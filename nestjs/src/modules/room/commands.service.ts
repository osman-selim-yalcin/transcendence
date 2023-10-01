import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Repository } from 'typeorm';
import {
  checkAuth,
  leaveheadler,
  roomModify,
  isMod,
  isUserInRoom,
  isBanned,
  isInvited,
} from 'src/functions/room';
import { verifyToken } from 'src/functions/token';
import { roomCommands } from 'src/types/room.dto';

@Injectable()
export class CommandsService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
  ) {}

  async inviteUser(token: string, roomDetails: roomCommands) {
    const { room, user } = await this.commandStart(token, roomDetails);
    if (isUserInRoom(room, user))
      throw new HttpException('user already in room', 400);
    if (isInvited(room, user))
      room.inviteList = room.inviteList.filter((u) => u !== user.username);
    else room.inviteList.push(user.username);
    return roomModify(await this.roomRep.save(room));
  }

  async kickUser(token: string, roomDetails: roomCommands) {
    const { loginUser, room, user } = await this.commandStart(
      token,
      roomDetails,
    );
    if (!isUserInRoom(room, user))
      throw new HttpException('user not in room', 400);
    if (
      (isMod(room, user) && loginUser.username !== room.creator) ||
      user.username === room.creator
    )
      throw new HttpException('not authorized', 400);
    leaveheadler(room, user);
    return roomModify(await this.roomRep.save(room));
  }

  async modUser(token: string, roomDetails: roomCommands) {
    const { loginUser, room, user } = await this.commandStart(
      token,
      roomDetails,
    );
    if (loginUser.username !== room.creator)
      throw new HttpException('not authorized', 400);
    if (!isUserInRoom(room, user))
      throw new HttpException('user not in room', 400);
    if (isMod(room, user))
      room.mods = room.mods.filter((u) => u !== user.username);
    else room.mods.push(user.username);
    return roomModify(await this.roomRep.save(room));
  }

  async banUser(token: string, roomDetails: roomCommands) {
    const { loginUser, room, user } = await this.commandStart(
      token,
      roomDetails,
    );
    if (
      (isMod(room, user) && loginUser.username !== room.creator) ||
      user.username === room.creator
    )
      throw new HttpException('not authorized', 400);
    if (!isUserInRoom(room, user))
      throw new HttpException('user not in room', 400);
    leaveheadler(room, user);
    if (isBanned(room, user))
      room.banList = room.banList.filter((u) => u !== user.username);
    else room.banList.push(user.username);
    return roomModify(await this.roomRep.save(room));
  }

  // UTILS
  async tokenToUser(token: string, relations?: string[]) {
    const loginUserInfo = verifyToken(token);
    return this.userRep.findOne({
      where: { id: loginUserInfo.id },
      relations: relations || [],
    });
  }

  async idToUser(id: number, relations?: string[]) {
    if (!id) throw new HttpException('user not found', 400);
    const user = await this.userRep.findOne({
      where: { id },
      relations: relations || [],
    });
    if (!user) throw new HttpException('user not found', 400);
    return user;
  }

  async idToRoom(id: number) {
    const room = await this.roomRep.findOne({
      where: { id },
      relations: ['users', 'messages'],
    });
    if (!room) throw new HttpException('room not found', 400);
    return room;
  }

  async commandStart(token: string, roomDetails: roomCommands) {
    const loginUser = await this.tokenToUser(token);
    const room = await this.idToRoom(roomDetails.id);
    checkAuth(room, loginUser);
    const user = await this.idToUser(roomDetails.user.id);
    return { loginUser, room, user };
  }
}
