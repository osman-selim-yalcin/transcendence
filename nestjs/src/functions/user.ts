import { HttpException } from '@nestjs/common';
import { User } from 'src/typeorm/User';
import { userStatus } from 'src/types/user.dto';

export function modifyBlockUser(user: User) {
  return {
    ...user,
    status: userStatus.BLOCKED,
    sessionID: null,
    avatar: null,
    lastSeen: null,
  };
}

export function isFriend(user: User, friend: User) {
  return user.friends.some((u) => u.id === friend.id);
}

export function isBlock(user: User, friend: User) {
  return user.blocked.some((u) => u.id === friend.id);
}

export function addFriendHelper(user: User, friend: User) {
  user.friends = user.friends ? [...user.friends, friend] : [friend];
  friend.friends = friend.friends ? [...friend.friends, user] : [user];
}

export function deleteFriendHelper(user: User, friend: User) {
  const isFriend = user.friends.some((u) => u.id === friend.id);
  if (!isFriend) throw new HttpException('not a friend', 400);
  user.friends = user.friends?.filter((f: User) => f.id !== friend.id);
  friend.friends = friend.friends?.filter((f: User) => f.id !== user.id);
}

export function blockUserHelper(user: User, friend: User) {
  const isBlock = user.blocked?.some((u) => u.id === friend.id);
  if (isBlock) {
    user.blocked = user.blocked?.filter((f: User) => f.id !== friend.id);
    friend.blocked = friend.blocked?.filter((f: User) => f.id !== user.id);
  } else {
    user.blocked = user.blocked ? [...user.blocked, friend] : [friend];
    friend.blocked = friend.blocked ? [...friend.blocked, user] : [user];
    user.friends = user.friends?.filter((f: User) => f.id !== friend.id);
    friend.friends = friend.friends?.filter((f: User) => f.id !== user.id);
  }
}
