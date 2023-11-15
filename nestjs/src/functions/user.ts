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

// export function userModify(user: User) {
//   return {
//     id: user.id,
//     username: user.username,
//     sessionID: user.sessionID,
//     status: user.status,
//     avatar: user.avatar,
//     lastSeen: user.lastSeen,
//     elo: user.elo,
//     displayName: user.displayName,
//     createdAt: user.createdAt,
//     twoFactorEnabled: null,
//     twoFactorSecret: null,
//     blockList: null,
//     friends: null,
//     rooms: null,
//     notifications: null,
//     oldAvatar: null,
//     won: null,
//     lost: null,
//   };
// }

export function isFriend(user: User, friend: User) {
  return user.friends.some((u) => u.id === friend.id);
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
  const isBlockBoolean = isBlocking(user, friend);
  if (isBlockBoolean) {
    user.blockList = user.blockList?.filter(
      (b) => b.blockedUser !== friend.username,
    );
  } else {
    user.blockList = [
      ...user.blockList,
      { blockingUser: user.username, blockedUser: friend.username },
    ];
    user.friends = user.friends?.filter((f: User) => f.id !== friend.id);
    friend.friends = friend.friends?.filter((f: User) => f.id !== user.id);
  }
}

export function isBlocking(user: User, friend: User) {
  return user.blockList.some(
    (blockList) => blockList.blockedUser === friend.username,
  );
}

export function isBlock(user: User, friend: User) {
  if (!user || !friend) {
    return false;
  }
  return (
    user.blockList.some(
      (blockList) => blockList.blockedUser === friend.username,
    ) ||
    friend.blockList.some(
      (blockList) => blockList.blockedUser === user.username,
    )
  );
}
