import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';

export function roomHelper(room: Room, loginUser: User) {
  if (!room.name) {
    const tmp = room.users.filter((u) => u.username !== loginUser.username);
    return {
      users: room.users,
      room: {
        roomID: room.id,
        name: tmp[0].username,
        avatar: tmp[0].avatar,
      },
      messages: room.messages,
      createdAt: room.createdAt,
    };
  }
  return {
    id: room.id,
    users: room.users,
    room: {
      roomID: room.id,
      name: room.name,
      avatar: room.avatar,
    },
    messages: room.messages,
    createdAt: room.createdAt,
  };
}
