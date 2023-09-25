import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Repository } from 'typeorm';
import {
  checksForJoin,
  hashPassword,
  checkAuth,
  leaveheadler,
  privateHandler,
  roomModify,
  isUserInRoom,
  isCreator,
} from 'src/functions/room';
import { verifyToken } from '../../functions/user';
import { roomDto } from 'src/types/room.dto';
import { Message } from 'src/typeorm/Message';
import { messageDto } from 'src/types/message.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
    @InjectRepository(Message) private messageRep: Repository<Message>,
  ) {}

  async getRooms(token: string, query: any) {
    if (query?.id) return this.idToRoom(query.id);
    const loginUser = await this.tokenToUser(token, [
      'rooms',
      'rooms.users',
      'rooms.messages',
    ]);
    const allRooms = await this.roomRep.find();
    const userRooms = [];
    for (const room of loginUser.rooms) userRooms.push(roomModify(room));
    const newAllRooms = [];
    for (const room of allRooms) newAllRooms.push(roomModify(room));
    return { newAllRooms, userRooms };
  }

  async createRoom(token: string, roomDetails: roomDto) {
    const loginUser = await this.tokenToUser(token, ['rooms']);
    const users: User[] = await this.idToUsers(
      roomDetails.users,
      loginUser.username,
    );
    if (!roomDetails.isGroup) privateHandler(users, loginUser);
    const room = this.roomRep.create({
      ...roomDetails,
      users: users,
      creator: loginUser.username,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      mods: [loginUser.username],
    });
    hashPassword(room);
    return roomModify(await this.roomRep.save(room));
  }

  async deleteRoom(token: string, roomDetails: roomDto) {
    const loginUser = await this.tokenToUser(token);
    const room = await this.idToRoom(roomDetails.id);
    if (!isCreator(room, loginUser))
      throw new HttpException('not authorized', 400);
    await this.roomRep.remove(room);
    return { msg: 'room deleted' };
  }

  async updateRoom(token: string, roomDetails: roomDto) {
    const loginUser = await this.tokenToUser(token);
    const room = await this.idToRoom(roomDetails.id);
    checkAuth(room, loginUser);
    hashPassword(roomDetails);
    roomDetails.users = room.users;
    roomDetails.isGroup = room.isGroup;
    return roomModify(await this.roomRep.save({ ...room, ...roomDetails }));
  }

  async joinRoom(token: string, roomDetails: roomDto) {
    const loginUser = await this.tokenToUser(token);
    const room = await this.idToRoom(roomDetails.id);
    console.log(isUserInRoom(room, loginUser));
    console.log(room.users);
    if (isUserInRoom(room, loginUser))
      throw new HttpException('user already in room', 400);
    checksForJoin(room, loginUser, roomDetails.password);
    room.users.push(loginUser);
    return roomModify(await this.roomRep.save(room));
  }

  async leaveRoom(token: string, roomDetails: roomDto) {
    const loginUser = await this.tokenToUser(token);
    const room = await this.idToRoom(roomDetails.id);
    if (!isUserInRoom(room, loginUser))
      throw new HttpException('user not in room', 400);
    leaveheadler(room, loginUser);
    if (room.users.length === 0) {
      await this.roomRep.remove(room);
      return { msg: 'room deleted cause no one left' };
    }
    return roomModify(await this.roomRep.save(room));
  }

  async createMsg(token: string, details: messageDto) {
    const loginUser = await this.tokenToUser(token);
    const room = await this.idToRoom(details.roomID);
    const msg = this.messageRep.create({
      owner: loginUser.username,
      content: details.content,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      room,
    });

    if (!room.messages) room.messages = [msg];
    else room.messages.push(msg);

    await this.roomRep.save(room);
    return this.messageRep.save(msg);
  }

  // ENDPOINT END HERE / UTILS START HERE
  async idToUsers(idUsers: User[], creator: string) {
    const creatorUser = await this.userRep.findOne({
      where: { username: creator },
    });

    const users: User[] = [creatorUser];
    for (const u of idUsers) {
      if (creatorUser.id === u.id || u.id === undefined) continue;
      const user = await this.userRep.findOne({ where: { id: u.id } });
      if (!user)
        throw new HttpException('user not found / users is wrong', 400);
      users.push(user);
    }
    return users;
  }

  async tokenToUser(token: string, relations?: string[]) {
    const loginUserInfo = verifyToken(token);
    return this.userRep.findOne({
      where: { id: loginUserInfo.id },
      relations: relations || [],
    });
  }

  async idToRoom(id: number) {
    const room = await this.roomRep.findOne({
      where: { id },
      relations: ['users', 'messages'],
    });
    if (!room) throw new HttpException('room not found', 400);
    return room;
  }
}
