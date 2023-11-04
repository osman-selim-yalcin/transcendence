import { HttpException } from '@nestjs/common';
import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';
import * as bcrypt from 'bcrypt';
import {
  notificationStatus,
  notificationTypes,
} from 'src/types/notification.dto';
import { roomDto } from 'src/types/room.dto';
import { isBlock } from './user';
import { userStatus } from 'src/types/user.dto';

export function userRoomModify(otherUser: User, user: User): User {
  return {
    id: otherUser.id,
    username: otherUser.username,
    sessionID: otherUser.sessionID,
    status: isBlock(user, otherUser) ? userStatus.BLOCKED : otherUser?.status,
    avatar: otherUser.avatar,
    lastSeen: otherUser.lastSeen,
    elo: otherUser.elo,
    displayName: otherUser.displayName,
    createdAt: otherUser.createdAt,
    twoFactorEnabled: null,
    twoFactorSecret: null,
    blockList: null,
    friends: null,
    rooms: null,
    notifications: null,
    oldAvatar: null,
    won: null,
    lost: null,
  };
}

export function userRoomModifyHandler(room: Room, user: User) {
  room.users = room.users.map((u) => userRoomModify(u, user));
  if (room.password) return { ...room, password: true };
  return { ...room, password: false };
}

export function roomModifyHandler(room: Room) {
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

export function hashPassword(password: string) {
  if (password) {
    password = password.toString();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
  return null;
}

export function checksForJoin(room: Room, loginUser: User, password: string) {
  if (isUserInRoom(room, loginUser))
    throw new HttpException('user already in room', 400);
  checkInvite(room, loginUser);
  checkBanned(room, loginUser);
  checkPassword(room, password);
}

export function checkPassword(room: Room, password: string) {
  if (room.password) {
    if (!password || !bcrypt.compareSync(password, room.password)) {
      throw new HttpException('password uncorrect', 400);
    }
  }
}

export function checkInvite(room: Room, loginUser: User) {
  if (room.isInviteOnly && !isRoomNotificationExist(room, loginUser)) {
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

export function isRoomNotificationExist(room: Room, loginUser: User) {
  const notification = loginUser.notifications?.find(
    (n) =>
      n.type === notificationTypes.ROOM &&
      n.roomID === room.id &&
      n.status === notificationStatus.QUESTION &&
      n.user.id === loginUser.id,
  );
  return notification;
}

export function isCreator(room: Room, user: User) {
  return room.creator === user.username;
}
