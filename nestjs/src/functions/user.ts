import { HttpException } from '@nestjs/common';
import { User } from 'src/typeorm/User';

export function isFriend(user: User, friend: User) {
  if (user.friends) {
    for (const f of user.friends) {
      if (f.id === friend.id) return true;
    }
  }
  return false;
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
