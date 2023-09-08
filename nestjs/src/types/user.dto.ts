import { IsNotEmpty } from 'class-validator';

export class userDto {
  @IsNotEmpty()
  username: string;

  id: number;
  sessionID: string;
  avatar: string;
  status: string;
  lastSeen: string;
  friends: userDto[];
  rooms: any[];
  notifications: any[];
}
