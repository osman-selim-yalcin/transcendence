import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Like, Repository } from 'typeorm';
import {
  checksForJoin,
  hashPassword,
  privateHandler,
  roomModify,
  isUserInRoom,
  isCreator,
  isRoomNotificationExist,
  isMod,
  userRoomModify,
} from 'src/functions/room';
import { roomDto } from 'src/types/room.dto';
import { Message } from 'src/typeorm/Message';
import { messageDto } from 'src/types/message.dto';
import { socketGateway } from 'src/gateway/socket.gateway';
import { Notification } from 'src/typeorm/Notification';
import { notificationStatus } from 'src/types/notification.dto';
import { isBlock, isFriend } from 'src/functions/user';

@Injectable()
export class RoomService {
  constructor(
    private server: socketGateway,
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
    @InjectRepository(Message) private messageRep: Repository<Message>,
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async getRooms(query: any) {
    if (query.take > 50) throw new HttpException('too many rooms', 400);
    if (query.id)
      return await this.roomRep.findOne({ where: { id: query.id } });
    const rooms = await this.roomRep.find({
      skip: query.skip ? query.skip : 0,
      take: query.take ? query.take : 10,
      where: { name: Like((query.q ? query.q : '') + '%') },
    });

    const newAllRooms = [];
    for (const room of rooms) newAllRooms.push(roomModify(room));
    return newAllRooms;
  }

  async getUserRooms(user: User) {
    const userRooms = [];
    for (const room of user.rooms) userRooms.push(userRoomModify(room, user));
    return userRooms;
  }

  async createRoom(user: User, roomDetails: roomDto) {
    const users: User[] = await this.idToUsers(roomDetails, user);
    if (!roomDetails.isGroup) privateHandler(users, user);
    if (!roomDetails.name)
      roomDetails.isGroup
        ? (roomDetails.name = 'default name')
        : (roomDetails.name = users[0].username + ' & ' + users[1].username);
    const room = await this.roomRep.save({
      name: roomDetails.name,
      isGroup: roomDetails.isGroup,
      isInviteOnly: roomDetails.isInviteOnly,
      password: roomDetails.password,
      users: users,
      creator: user.username,
      mods: [user.username],
    });
    hashPassword(room);
    for (const u of room.users)
      this.server.joinRoom(u.sessionID, room.id.toString());
    return await this.roomRep.save(room);
  }

  async deleteRoom(user: User, room: Room) {
    if (!room.isGroup || (room.isGroup && !isCreator(room, user)))
      throw new HttpException('not authorized', 400);
    (await this.notificationRep.find()).map((n) => {
      if (n.roomID === room.id) this.notificationRep.remove(n);
    });
    await this.roomRep.remove(room);
    return { msg: 'room deleted' };
  }

  async updateRoom(user: User, room: Room, roomDetails: roomDto) {
    if (!room.isGroup || !isCreator(room, user))
      throw new HttpException('not authorized', 400);
    hashPassword(roomDetails);
    if (roomDetails.isGroup) room.isGroup = roomDetails.isGroup;
    if (roomDetails.isInviteOnly) room.isInviteOnly = roomDetails.isInviteOnly;
    if (roomDetails.name) room.name = roomDetails.name;
    if (roomDetails.password) room.password = roomDetails.password;
    this.specialMsg('room updated', room);
    await this.roomRep.save({ ...room });
    return { msg: 'room updated' };
  }

  async joinRoom(user: User, room: Room, roomDetails: roomDto) {
    if (!room.isGroup)
      throw new HttpException('private room cannot be joinable', 400);
    const notification = isRoomNotificationExist(room, user);
    if (notification) {
      await this.notificationRep.save({
        type: notification.type,
        content: `${user.username} accepted your invite request`,
        status: notificationStatus.ACCEPTED,
        user: notification.creator,
        creator: notification.user,
      });
      await this.notificationRep.remove(notification);
    } else checksForJoin(room, user, roomDetails.password);
    room.users.push(user);
    this.server.joinRoom(user.sessionID, room.id.toString());
    this.specialMsg(user.username + ' joined', room);
    await this.roomRep.save(room);
    return { msg: 'user join the room' };
  }

  async leaveRoom(user: User, room: Room) {
    if (!room.isGroup)
      throw new HttpException('private room cannot be leaveable', 400);
    if (!isUserInRoom(room, user))
      throw new HttpException('user not in room', 400);
    await this.leaveheadler(room, user);
    return { msg: 'user leaved' };
  }

  async createMsg(user: User, room: Room, details: messageDto) {
    if (!isUserInRoom(room, user))
      throw new HttpException('user not in room', 400);
    if (await this.isMuted(room, user))
      throw new HttpException('user muted', 400);
    if (!room.isGroup) {
      const otherUser = room.users.find((u) => u.id !== user.id);
      if (isBlock(user, otherUser))
        throw new HttpException('user blocked you cant send a message', 400);
    }

    const msg = this.messageRep.create({
      owner: user.username,
      content: details.content,
      room,
    });
    const msgSaved = await this.messageRep.save(msg);
    this.modifyMsg(room, msgSaved);
    return { msg: 'message created' };
  }

  // ENDPOINT END HERE / UTILS START HERE
  async idToUsers(roomDetails: roomDto, creator: User) {
    const users: User[] = [
      await this.userRep.findOne({ where: { id: creator.id } }),
    ];
    if (roomDetails.users)
      for (const u of roomDetails.users) {
        if (creator.id === u.id || u.id === undefined) continue;
        const user = await this.userRep.findOne({ where: { id: u.id } });
        if (!user)
          throw new HttpException('user not found / users is wrong', 400);
        if (roomDetails.isGroup && !isFriend(creator, user))
          throw new HttpException('not friend', 400);
        users.push(user);
      }
    return users;
  }

  async idToRoom(id: number) {
    const room = await this.roomRep.findOne({
      where: { id },
      relations: ['users', 'messages'],
    });
    if (!room) throw new HttpException('room not found', 400);
    return room;
  }

  async isMuted(room: Room, user: User) {
    return room.muteList.find((u) => u.username === user.username);
  }

  async specialMsg(content: string, room: Room) {
    const msg = this.messageRep.create({
      owner: room.id.toString(),
      content: content,
      room,
    });
    const msgSaved = await this.messageRep.save(msg);
    this.modifyMsg(room, msgSaved);
    return msgSaved;
  }

  async modifyMsg(room: Room, msg: Message) {
    this.server.onPrivateMessage({
      to: room.id.toString(),
      msg: {
        ...msg,
        room: room.id,
      },
    });
  }

  async leaveheadler(room: Room, user: User) {
    room.users = room.users.filter((u) => u.id !== user.id);
    if (isMod(room, user))
      room.mods = room.mods.filter((u) => u !== user.username);

    if (room.users.length === 0) {
      await this.roomRep.remove(room);
      throw new HttpException('room deleted cause no user', 200);
    }

    if (isCreator(room, user)) {
      if (room.mods.length > 0) room.creator = room.mods[0];
      else {
        room.creator = room.users.find((u) => u.id !== user.id).username;
        room.mods.push(room.creator);
      }
    }

    this.specialMsg(user.username + ' leave', room);
    await this.roomRep.save(room);
  }
}
