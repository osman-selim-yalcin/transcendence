import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Notification } from 'src/typeorm/Notification';
import { Room } from 'src/typeorm/Room';

export class userDto {
  @IsEmpty()
  username: string;

  avatar: string;

  @IsNotEmpty()
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
