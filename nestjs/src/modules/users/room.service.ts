import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { roomHelper } from 'src/functions/room';
import { verifyToken, hashPassword } from '../../functions/user';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
  ) {}

  async startRoom(token: string, details: any) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['rooms', 'rooms.users', 'rooms.messages'],
    });

    if (!details.username) throw new HttpException('username is required', 400);
    const friendUser = await this.userRep.findOneBy({
      username: details.username,
    });

    if (loginUser.id === friendUser.id)
      throw new HttpException('same user', 400);

    const roomDeatils = {
      users: [friendUser, loginUser],
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
    };

    const tmp = [friendUser.id, loginUser.id];

    const rooms = loginUser.rooms;

    for (const r of rooms) {
      const ids = r.users.map((u) => u.id);
      if (ids.length === 2 && ids.sort().toString() === tmp.sort().toString()) {
        return roomHelper(r, loginUser);
      }
    }

    const room = this.roomRep.create(roomDeatils);
    await this.roomRep.save(room);
    return roomHelper(room, loginUser);
  }

  async exitRoom(token: string, roomID: number) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });

    const room = await this.roomRep.findOne({
      where: { id: roomID },
      relations: ['users'],
    });
    if (!room) throw new HttpException('room not found', 400);

    const users = room.users.filter((u) => u.id !== loginUser.id);
    room.users = users;
    await this.roomRep.save(room);
    return { msg: 'success' };
  }

  async deleteRoom(roomID: number) {
    const room = await this.roomRep.findOne({
      where: { id: roomID },
      relations: ['messages', 'users'],
    });
    await this.roomRep.remove(room);
    return { msg: 'success' };
  }

  async getUsersRooms(token: string) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['rooms', 'rooms.users', 'rooms.messages'],
    });
    const rooms = loginUser.rooms.map((room) => {
      return roomHelper(room, loginUser);
    });
    return rooms;
  }

  async createGroup(token: string, details: any) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });
    if (!details.name) throw new HttpException('name is required', 400);

    const users = [loginUser];
    for (const u of details.users) {
      const user = await this.userRep.findOne({ where: { username: u } });
      if (!user) throw new HttpException('user not found', 400);
      users.push(user);
    }

    if (details.password) details.password = hashPassword(details.password);

    const roomDeatils = {
      ...details,
      creator: loginUser.username,
      users,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      isGroup: true,
    };

    const room = this.roomRep.create(roomDeatils);
    await this.roomRep.save(room);
    return room;
  }

  async joinGroup(token: string, details: any) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });

    if (!details.roomID) throw new HttpException('roomID is required', 400);

    const room = await this.roomRep.findOne({
      where: { id: details.roomID },
      relations: ['users'],
    });

    if (!room) throw new HttpException('room not found', 400);

    for (const u of room.users) {
      if (u.id === loginUser.id) throw new HttpException('already joined', 400);
    }

    if (room.password) {
      if (!bcrypt.compareSync(details.password, room.password))
        throw new HttpException('wrong password', 400);
    }

    room.users.push(loginUser);
    await this.roomRep.save(room);
    return room;
  }

  async getGroups() {
    const rooms = await this.roomRep.find({
      where: { isGroup: true },
      relations: ['users', 'messages'],
    });

    return rooms.map((room) => {
      return roomHelper(room, null);
    });
  }

  async updateGroup(token: string, details: any) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });

    if (!details.roomID) throw new HttpException('roomID is required', 400);

    const room = await this.roomRep.findOne({
      where: { id: details.roomID },
      relations: ['users'],
    });

    if (!room) throw new HttpException('room not found', 400);

    if (room.creator !== loginUser.username)
      throw new HttpException('not authorized', 400);

    return this.roomRep.save({
      ...room,
      ...details,
    });
  }
}
