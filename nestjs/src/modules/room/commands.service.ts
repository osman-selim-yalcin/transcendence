import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Repository } from 'typeorm';
import {
  userRoomModifyHandler,
  isMod,
  isUserInRoom,
  isBanned,
  isRoomNotificationExist,
} from 'src/functions/room';
import { Notification } from 'src/typeorm/Notification';
import {
  notificationStatus,
  notificationTypes,
} from 'src/types/notification.dto';
import { RoomService } from './room.service';
import { setTimeout } from 'timers';
import { socketGateway } from 'src/gateway/socket.gateway';

@Injectable()
export class CommandsService {
  constructor(
    private roomService: RoomService,
    @InjectRepository(Room) private roomRep: Repository<Room>,
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
    private server: socketGateway,
  ) {}

  async inviteUser(user: User, room: Room, otherUser: User) {
    if (isUserInRoom(room, otherUser))
      throw new HttpException('user already in room', 400);
    if (isRoomNotificationExist(room, otherUser))
      throw new HttpException('user already invited', 400);
    this.createInviteNotifcations(user, room, otherUser);
    if (room.banList.includes(otherUser.username))
      room.banList = room.banList.filter((u) => u !== otherUser.username);
    return userRoomModifyHandler(await this.roomRep.save(room), user);
  }

  async kickUser(user: User, room: Room, otherUser: User) {
    if (!isUserInRoom(room, otherUser))
      throw new HttpException('user not in room', 400);
    if (
      (isMod(room, otherUser) && user.username !== room.creator) ||
      otherUser.username === room.creator
    )
      throw new HttpException('not authorized', 400);
    this.kickHandler(user, room, otherUser);
    await this.roomService.leaveheadler(room, otherUser);

    //reload room
    room.users.map((u) => this.server.reloadRoom(u));
    return userRoomModifyHandler(await this.roomRep.save(room), user);
  }

  async modUser(user: User, room: Room, otherUser: User) {
    if (user.username !== room.creator)
      throw new HttpException('not authorized', 400);
    if (!isUserInRoom(room, otherUser))
      throw new HttpException('user not in room', 400);
    if (isMod(room, otherUser)) {
      room.mods = room.mods.filter((u) => u !== otherUser.username);
      this.modHandler(user, room, otherUser);
    } else {
      room.mods.push(otherUser.username);
      this.modHandler(user, room, otherUser, notificationStatus.ACCEPTED);
    }

    //reload room
    room.users.map((u) => this.server.reloadRoom(u));
    return userRoomModifyHandler(await this.roomRep.save(room), user);
  }

  async banUser(user: User, room: Room, otherUser: User) {
    if (
      (isMod(room, otherUser) && user.username !== room.creator) ||
      otherUser.username === room.creator
    )
      throw new HttpException('not authorized', 400);
    if (isBanned(room, otherUser)) {
      room.banList = room.banList.filter((u) => u !== otherUser.username);
      // this.banHandler(user, room, otherUser, notificationStatus.ACCEPTED);
    } else {
      if (isUserInRoom(room, otherUser)) {
        this.banHandler(user, room, otherUser);
        await this.roomService.leaveheadler(room, otherUser);
      }
      room.banList.push(otherUser.username);
      const notification = isRoomNotificationExist(room, otherUser);
      if (notification) await this.notificationRep.remove(notification);
    }

    //reload room
    room.users.map((u) => this.server.reloadRoom(u));
    return userRoomModifyHandler(await this.roomRep.save(room), user);
  }

  async muteUser(user: User, room: Room, otherUser: User) {
    if (
      (isMod(room, otherUser) && user.username !== room.creator) ||
      otherUser.username === room.creator
    )
      throw new HttpException('not authorized', 400);
    let content = `${otherUser.username} will be muted for 10 min`;

    if (await this.roomService.isMuted(room, otherUser)) {
      content = `${otherUser.username} unmuted`;
      clearTimeout(
        room.muteList.find((u) => u.username === otherUser.username).time,
      );
      this.unMuteHandler(room, otherUser);
    } else {
      const timeoutID = setTimeout(() => {
        this.unMuteHandler(room, otherUser);
      }, 1000 * 60 * 10);
      room.muteList.push({
        username: otherUser.username,
        time: timeoutID[Symbol.toPrimitive](),
      });
      //reload room
      room.users.map((u) => this.server.reloadRoom(u));
      await this.roomRep.save(room);
    }
    throw new HttpException(content, 200);
  }

  //utils for notification
  async createInviteNotifcations(user: User, room: Room, friendUser: User) {
    const notification = await this.notificationRep.save({
      roomID: room.id,
      content: `${user.username} invited you to ${room.name}`,
      type: notificationTypes.ROOM,
      creator: user,
      user: friendUser,
      status: notificationStatus.QUESTION,
    });
    const siblingNotificaiton = await this.notificationRep.save({
      roomID: room.id,
      content: `You invited ${friendUser.username} to ${room.name}`,
      creator: friendUser,
      user: user,
      type: notificationTypes.ROOM,
      status: notificationStatus.PENDING,
      sibling: notification,
    });
    notification.sibling = siblingNotificaiton;
    this.server.reloadNotification(user);
    this.server.reloadNotification(friendUser);
    await this.notificationRep.save(notification);
  }

  async createCommandNotifcation(
    user: User,
    room: Room,
    friendUser: User,
    type: notificationTypes,
    status: notificationStatus,
    content: string,
  ) {
    await this.notificationRep.save({
      roomID: room.id,
      content,
      type: type,
      status: status,
      creator: user,
      user: friendUser,
    });
  }

  async kickHandler(user: User, room: Room, friendUser: User) {
    const content = `${user.username} kicked you from ${room.name}`;
    await this.createCommandNotifcation(
      user,
      room,
      friendUser,
      notificationTypes.KICK,
      notificationStatus.DECLINED,
      content,
    );
  }

  async modHandler(
    user: User,
    room: Room,
    friendUser: User,
    status: notificationStatus = notificationStatus.DECLINED,
  ) {
    let content = `${user.username} mod you from ${room.name}`;
    if (status === notificationStatus.ACCEPTED) {
      content = `${user.username} unmod you from ${room.name}`;
    }
    await this.createCommandNotifcation(
      user,
      room,
      friendUser,
      notificationTypes.MOD,
      status,
      content,
    );
  }

  async banHandler(
    user: User,
    room: Room,
    friendUser: User,
    status: notificationStatus = notificationStatus.DECLINED,
  ) {
    let content = `${user.username} banned you from ${room.name}`;
    if (status === notificationStatus.ACCEPTED) {
      content = `${user.username} unbanned you from ${room.name}`;
    }
    await this.createCommandNotifcation(
      user,
      room,
      friendUser,
      notificationTypes.BAN,
      status,
      content,
    );
  }

  async unMuteHandler(room: Room, otherUser: User) {
    room.muteList = room.muteList.filter(
      (u) => u.username !== otherUser.username,
    );
    await this.roomRep.save(room);
    room.users.map((u) => this.server.reloadRoom(u));
  }
}
