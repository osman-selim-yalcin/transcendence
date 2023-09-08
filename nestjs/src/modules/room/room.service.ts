import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Repository } from 'typeorm';
import {
  authorizedHandler,
  checkInviteList,
  checkPassword,
  hashPassword,
  privateHandler,
} from 'src/functions/room';
import { verifyToken } from '../../functions/user';
import { roomDto } from 'src/types/room.dto';
import { Message } from 'src/typeorm/Message';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
    @InjectRepository(Message) private messageRep: Repository<Message>,
  ) {}

  async getRooms(token: string) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['rooms', 'rooms.users'],
    });
    const rooms = await this.roomRep.find({
      relations: ['users'],
    });
    const userRooms = loginUser.rooms;

    return { rooms, userRooms };
  }

  async createRoom(token: string, roomDetails: roomDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['rooms', 'rooms.users', 'rooms.messages'],
    });

    privateHandler(roomDetails, loginUser);
    hashPassword(roomDetails);

    const users: User[] = [];
    for (const u of roomDetails.users) {
      users.push(
        await this.userRep.findOne({ where: { username: u.username } }),
      );
    }
    roomDetails.users = users;

    const room = this.roomRep.create(roomDetails);
    return this.roomRep.save(room);
  }

  async deleteRoom(token: string, roomDetails: roomDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['rooms', 'rooms.users', 'rooms.messages'],
    });

    const room = await this.roomRep.findOne({
      where: { id: roomDetails.id },
      relations: ['messages', 'users'],
    });

    if (!room) throw new HttpException('room not found', 400);
    authorizedHandler(room, loginUser);

    await this.roomRep.remove(room);
    return room;
  }

  async updateRoom(token: string, roomDetails: roomDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });

    const room = await this.roomRep.findOne({
      where: { id: roomDetails.id },
      relations: ['users', 'messages'],
    });

    if (!room) throw new HttpException('room not found', 400);
    if (!roomDetails.isGroup && roomDetails.name !== room.name)
      throw new HttpException('private room name cannot be changed', 400);
    if (roomDetails.users.length <= 0)
      throw new HttpException('room must have at least one user', 400);
    authorizedHandler(room, loginUser);
    hashPassword(roomDetails);

    return this.roomRep.save({ ...room, ...roomDetails });
  }

  async joinRoom(token: string, roomDetails: roomDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });

    const room = await this.roomRep.findOne({
      where: { id: roomDetails.id },
      relations: ['users', 'messages'],
    });

    if (!room) throw new HttpException('room not found', 400);
    checkPassword(room, roomDetails.password);
    checkInviteList(room, loginUser);

    room.users.push(loginUser);
    return this.roomRep.save(room);
  }

  async createMsg(details: any) {
    const room = await this.roomRep.findOne({
      relations: ['messages'],
      where: { id: details.room.id },
    });
    const msg = this.messageRep.create({
      owner: details.owner,
      content: details.msg,
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
}
