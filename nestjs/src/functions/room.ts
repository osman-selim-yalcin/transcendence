import { HttpException } from '@nestjs/common';
import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';
import * as bcrypt from 'bcrypt';

export function privateHandler(room: Room, loginUser: User) {
  if (!room.isGroup && room.name === loginUser.username)
    throw new HttpException('same user', 400);

  const rooms = loginUser.rooms;

  for (const r of rooms) {
    if (!room.isGroup && r.name === room.name) {
      throw new HttpException('room already exist', 400);
    }
  }
}

export function authorizedHandler(room: Room, loginUser: User) {
  if (room.creator !== loginUser.username)
    throw new HttpException('not authorized', 400);
}

export function checkPassword(room: Room, password: string) {
  if (room.password) {
    if (!bcrypt.compareSync(password, room.password)) {
      throw new HttpException('password uncorrect', 400);
    }
  }
}

export function hashPassword(room: Room) {
  if (room.password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(room.password, salt);
    room.password = hash;
  }
}

export function checkInviteList(room: Room, loginUser: User) {
  if (room.isInviteOnly && !room.inviteList.includes(loginUser.username)) {
    throw new HttpException('not invited', 400);
  }
}
