import { HttpException } from '@nestjs/common';
import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';
import * as bcrypt from 'bcrypt';

export function roomModify(room: Room) {
  if (room.password) return { ...room, password: true };
  return { ...room, password: false };
}

export function privateHandler(users: User[], loginUser: User) {
  if (users.length !== 2)
    throw new HttpException('private room can only have 2 users', 400);

  const user = users.find((u) => u.id !== loginUser.id);
  const rooms = loginUser.rooms?.filter((r) => r.isGroup === false);
  for (const r of rooms) {
    if (r.users?.find((u) => u.id === user.id)) {
      throw new HttpException('room already exists', 400);
    }
  }
}

export function hashPassword(room: Room) {
  if (room.password) {
    room.password = room.password.toString();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(room.password, salt);
    room.password = hash;
  }
}

export function leaveheadler(room: Room, user: User) {
  if (isCreator(room, user)) {
    if (room.users.length > 0) {
      if (room.mods.length > 0) room.creator = room.mods[1];
      else room.creator = room.users.find((u) => u.id !== user.id).username;
    } else {
      room.creator = null;
    }
  }

  if (isMod(room, user)) {
    room.mods = room.mods.filter((u) => u !== user.username);
  }
  room.users = room.users.filter((u) => u.id !== user.id);
}

export function checksForJoin(room: Room, loginUser: User, password: string) {
  checkInvite(room, loginUser);
  checkBanned(room, loginUser);
  checkPassword(room, password);
}

export function checkPassword(room: Room, password: string) {
  if (room.password) {
    if (!bcrypt.compareSync(password, room.password)) {
      throw new HttpException('password uncorrect', 400);
    }
  }
}

export function checkInvite(room: Room, loginUser: User) {
  if (room.isInviteOnly && !room.inviteList.includes(loginUser.username)) {
    throw new HttpException('not invited', 400);
  }
}

export function checkBanned(room: Room, loginUser: User) {
  if (room.banList.includes(loginUser.username))
    throw new HttpException('you are banned', 400);
}

export function checkAuth(room: Room, loginUser: User) {
  if (!isMod(room, loginUser)) throw new HttpException('not authorized', 400);
}

export function isUserInRoom(room: Room, user: User) {
  return room.users.find((u) => u.id === user.id);
}

export function isMod(room: Room, user: User) {
  return room.mods.includes(user.username);
}

export function isBanned(room: Room, user: User) {
  return room.banList.includes(user.username);
}

export function isInvited(room: Room, user: User) {
  return room.inviteList.includes(user.username);
}

export function isCreator(room: Room, user: User) {
  return room.creator === user.username;
}
