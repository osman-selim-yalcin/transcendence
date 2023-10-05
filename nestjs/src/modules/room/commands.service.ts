import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Repository } from 'typeorm';
import {
  leaveheadler,
  roomModify,
  isMod,
  isUserInRoom,
  isBanned,
  isInvited,
} from 'src/functions/room';

@Injectable()
export class CommandsService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
  ) {}

  async inviteUser(otherUser: User, room: Room) {
    if (isUserInRoom(room, otherUser))
      throw new HttpException('user already in room', 400);
    if (isInvited(room, otherUser))
      room.inviteList = room.inviteList.filter((u) => u !== otherUser.username);
    else room.inviteList.push(otherUser.username);
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
    leaveheadler(room, otherUser);
    return roomModify(await this.roomRep.save(room));
  }

  async modUser(user: User, room: Room, otherUser: User) {
    if (user.username !== room.creator)
      throw new HttpException('not authorized', 400);
    if (!isUserInRoom(room, otherUser))
      throw new HttpException('user not in room', 400);
    if (isMod(room, otherUser))
      room.mods = room.mods.filter((u) => u !== otherUser.username);
    else room.mods.push(otherUser.username);
    return roomModify(await this.roomRep.save(room));
  }

  async banUser(user: User, room: Room, otherUser: User) {
    if (
      (isMod(room, otherUser) && user.username !== room.creator) ||
      otherUser.username === room.creator
    )
      throw new HttpException('not authorized', 400);
    if (!isUserInRoom(room, otherUser))
      throw new HttpException('user not in room', 400);
    leaveheadler(room, otherUser);
    if (isBanned(room, otherUser))
      room.banList = room.banList.filter((u) => u !== otherUser.username);
    else room.banList.push(otherUser.username);
    return roomModify(await this.roomRep.save(room));
  }
}
