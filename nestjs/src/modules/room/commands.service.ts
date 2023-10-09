import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Repository } from 'typeorm';
import {
  roomModify,
  isMod,
  isUserInRoom,
  isBanned,
  isRoomNotification,
} from 'src/functions/room';
import { Notification } from 'src/typeorm/Notification';
import {
  notificationStatus,
  notificationTypes,
} from 'src/types/notification.dto';
import { RoomService } from './room.service';

@Injectable()
export class CommandsService {
  constructor(
    private roomService: RoomService,
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async inviteUser(user: User, room: Room, otherUser: User) {
    if (isUserInRoom(room, otherUser))
      throw new HttpException('user already in room', 400);
    if (isRoomNotification(room, otherUser))
      throw new HttpException('user already invited', 400);
    this.createInviteNotifcations(user, room, otherUser);
    return roomModify(await this.roomRep.save(room));
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
    this.roomService.leaveheadler(room, otherUser);
    return roomModify(await this.roomRep.save(room));
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
    return roomModify(await this.roomRep.save(room));
  }

  async banUser(user: User, room: Room, otherUser: User) {
    if (
      (isMod(room, otherUser) && user.username !== room.creator) ||
      otherUser.username === room.creator
    )
      throw new HttpException('not authorized', 400);
    if (isBanned(room, otherUser)) {
      room.banList = room.banList.filter((u) => u !== otherUser.username);
      this.banHandler(user, room, otherUser);
    } else {
      if (!isUserInRoom(room, otherUser))
        throw new HttpException('user not in room', 400);
      room.banList.push(otherUser.username);
      this.banHandler(user, room, otherUser, notificationStatus.ACCEPTED);
    }
    this.roomService.leaveheadler(room, otherUser);
    return roomModify(await this.roomRep.save(room));
  }

  //utils for notification
  async createInviteNotifcations(user: User, room: Room, friendUser: User) {
    const notification = await this.notificationRep.save({
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      roomID: room.id,
      type: notificationTypes.ROOM,
      creator: user,
      user: friendUser,
      status: notificationStatus.QUESTION,
    });
    const siblingNotificaiton = await this.notificationRep.save({
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      roomID: room.id,
      creator: friendUser,
      user: user,
      type: notificationTypes.ROOM,
      status: notificationStatus.PENDING,
      sibling: notification,
    });
    notification.sibling = siblingNotificaiton;
    await this.notificationRep.save(notification);
  }

  async createCommandNotifcation(
    user: User,
    room: Room,
    friendUser: User,
    type: notificationTypes,
    status: notificationStatus,
  ) {
    const notification = await this.notificationRep.save({
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      roomID: room.id,
      type: type,
      status: status,
      creator: user,
      user: friendUser,
    });
    await this.notificationRep.save(notification);
  }

  async kickHandler(user: User, room: Room, friendUser: User) {
    await this.createCommandNotifcation(
      user,
      room,
      friendUser,
      notificationTypes.KICK,
      notificationStatus.DECLINED,
    );
  }

  async modHandler(
    user: User,
    room: Room,
    friendUser: User,
    status: notificationStatus = notificationStatus.DECLINED,
  ) {
    await this.createCommandNotifcation(
      user,
      room,
      friendUser,
      notificationTypes.MOD,
      status,
    );
  }

  async banHandler(
    user: User,
    room: Room,
    friendUser: User,
    status: notificationStatus = notificationStatus.DECLINED,
  ) {
    await this.createCommandNotifcation(
      user,
      room,
      friendUser,
      notificationTypes.BAN,
      status,
    );
  }
}
