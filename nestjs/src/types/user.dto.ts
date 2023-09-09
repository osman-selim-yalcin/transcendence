import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Notification } from 'src/typeorm/Notification';
import { Room } from 'src/typeorm/Room';

export class userDto {
  @IsEmpty()
  username: string;

  avatar: string;
  id: number;

  @IsEmpty()
  sessionID: string;

  @IsEmpty()
  lastSeen: string;

  @IsEmpty()
  status: string;

  @IsEmpty()
  friends: userDto[];

  @IsEmpty()
  rooms: Room[];

  @IsEmpty()
  notifications: Notification[];
}

export class currentUser {
  username: string;
  sessionID: string;
  avatar: string;
}

export class thirdUser {
  id: number;
  username: string;
  sessionID: string;
  status: string;
  avatar: string;
}
