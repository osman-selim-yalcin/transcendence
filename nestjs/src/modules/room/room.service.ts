import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Like, Repository } from 'typeorm';
import {
  checksForJoin,
  hashPassword,
  leaveheadler,
  privateHandler,
  roomModify,
  isUserInRoom,
  isCreator,
} from 'src/functions/room';
import { roomDto } from 'src/types/room.dto';
import { Message } from 'src/typeorm/Message';
import { messageDto } from 'src/types/message.dto';
import { socketGateway } from 'src/gateway/socket.gateway';

@Injectable()
export class RoomService {
  constructor(
    private server: socketGateway,
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
    @InjectRepository(Message) private messageRep: Repository<Message>,
  ) {}

  async getRooms(query: any) {
    if (query.take > 50) throw new HttpException('too many rooms', 400);
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
    for (const room of user.rooms) userRooms.push(roomModify(room));
    return userRooms;
  }

  async createRoom(user: User, roomDetails: roomDto) {
    const users: User[] = await this.idToUsers(roomDetails.users, user);
    if (!roomDetails.isGroup) privateHandler(users, user);
    const room = this.roomRep.create({
      ...roomDetails,
      users: users,
      creator: user.username,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      mods: [user.username],
    });
    hashPassword(room);
    for (const u of room.users)
      this.server.joinRoom(u.sessionID, room.id.toString());
    return roomModify(await this.roomRep.save(room));
  }

  async deleteRoom(user: User, room: Room) {
    if (room.isGroup && !isCreator(room, user))
      throw new HttpException('not authorized', 400);
    await this.roomRep.remove(room);
    return { msg: 'room deleted' };
  }

  async updateRoom(user: User, room: Room, roomDetails: roomDto) {
    if (!room.isGroup || !isCreator(room, user))
      throw new HttpException('not authorized', 400);
    hashPassword(roomDetails);
    roomDetails.id = room.id;
    roomDetails.users = room.users;
    roomDetails.isGroup = room.isGroup;
    this.specialMsg({
      owner: 'admin',
      content: 'room updated',
      id: room.id,
      createdAt: '',
    });
    return roomModify(await this.roomRep.save({ ...room, ...roomDetails }));
  }

  async joinRoom(user: User, room: Room, roomDetails: roomDto) {
    if (isUserInRoom(room, user))
      throw new HttpException('user already in room', 400);
    checksForJoin(room, user, roomDetails.password);
    room.users.push(user);
    this.specialMsg({
      owner: 'admin',
      content: user.username + 'joined',
      id: room.id,
      createdAt: '',
    });
    return roomModify(await this.roomRep.save(room));
  }

  async leaveRoom(user: User, room: Room) {
    if (!isUserInRoom(room, user))
      throw new HttpException('user not in room', 400);
    leaveheadler(room, user);
    if (room.users.length === 0) {
      await this.roomRep.remove(room);
      return { msg: 'room deleted cause no one left' };
    }
    this.specialMsg({
      owner: 'admin',
      content: user.username + 'leaved',
      id: room.id,
      createdAt: '',
    });
    return roomModify(await this.roomRep.save(room));
  }

  async createMsg(user: User, details: messageDto) {
    const room = await this.idToRoom(details.id);
    const msg = this.messageRep.create({
      owner: user.username,
      content: details.content,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      room,
    });
    const msgSaved = await this.messageRep.save(msg);
    this.modifyMsg(room, msgSaved);
    return msgSaved;
  }

  // ENDPOINT END HERE / UTILS START HERE
  async idToUsers(idUsers: User[], creator: User) {
    const users: User[] = [
      await this.userRep.findOne({ where: { id: creator.id } }),
    ];
    for (const u of idUsers) {
      if (creator.id === u.id || u.id === undefined) continue;
      const user = await this.userRep.findOne({ where: { id: u.id } });
      if (!user)
        throw new HttpException('user not found / users is wrong', 400);
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

  async specialMsg(details: messageDto) {
    const room = await this.idToRoom(details.id);
    const msg = this.messageRep.create({
      owner: 'admin',
      content: details.content,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      room,
    });
    const msgSaved = await this.messageRep.save(msg);
    this.modifyMsg(room, msgSaved);
    return msgSaved;
  }

  async modifyMsg(room: Room, msg: Message) {
    this.server.onPrivateMessage({
      to: room.id.toString(),
      msg: { ...msg, room: room.id },
    });
  }
}
