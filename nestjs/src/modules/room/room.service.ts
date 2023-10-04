import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Like, Repository } from 'typeorm';
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
    for (const room of user.rooms) {
      userRooms.push(roomModify(room));
    }

    return userRooms;
  }

  async createRoom(user: User, roomDetails: roomDto) {
    const users: User[] = await this.idToUsers(
      roomDetails.users,
      user.username,
    );
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
    return roomModify(await this.roomRep.save(room));
  }

  async deleteRoom(user: User, roomDetails: roomDto) {
    const room = await this.idToRoom(roomDetails.id);
    if (!isCreator(room, user)) throw new HttpException('not authorized', 400);
    await this.roomRep.remove(room);
    return { msg: 'room deleted' };
  }

  async updateRoom(user: User, roomDetails: roomDto) {
    const room = await this.idToRoom(roomDetails.id);
    checkAuth(room, user);
    hashPassword(roomDetails);
    roomDetails.users = room.users;
    roomDetails.isGroup = room.isGroup;
    return roomModify(await this.roomRep.save({ ...room, ...roomDetails }));
  }

  async joinRoom(user: User, roomDetails: roomDto) {
    const room = await this.idToRoom(roomDetails.id);
    if (isUserInRoom(room, user))
      throw new HttpException('user already in room', 400);
    checksForJoin(room, user, roomDetails.password);
    room.users.push(user);
    return roomModify(await this.roomRep.save(room));
  }

  async leaveRoom(user: User, roomDetails: roomDto) {
    const room = await this.idToRoom(roomDetails.id);
    if (!isUserInRoom(room, user))
      throw new HttpException('user not in room', 400);
    leaveheadler(room, user);
    if (room.users.length === 0) {
      await this.roomRep.remove(room);
      return { msg: 'room deleted cause no one left' };
    }
    return roomModify(await this.roomRep.save(room));
  }

  async createMsg(user: User, details: messageDto) {
    const room = await this.idToRoom(details.roomID);
    const msg = this.messageRep.create({
      owner: user.username,
      content: details.content,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      room,
    });
    console.log('msg', details.roomID);
    this.server.onPrivateMessage(null, {
      to: details.roomID.toString(),
      msg,
    });
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

  async idToRoom(id: number) {
    const room = await this.roomRep.findOne({
      where: { id },
      relations: ['users', 'messages'],
    });
    if (!room) throw new HttpException('room not found', 400);
    return room;
  }

  // async joinRooms(user: User) {
  //   for (const room of user.rooms) {
  //     this.server.onJoinRoom(null, {
  //       clients: [user.sessionID],
  //       room: room.id.toString(),
  //     });
  //   }
  // }
}
