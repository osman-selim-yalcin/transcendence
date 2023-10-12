import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Notification } from 'src/typeorm/Notification';
import { Room } from 'src/typeorm/Room';

export enum userStatus {
  ONLINE,
  OFFLINE,
  INGAME,
  AWAY,
  BUSY,
}

export class userDto {
  @IsString()
  @IsOptional()
  avatar: string;

  @IsOptional()
  @IsNumber()
  id: number;

  @IsEmpty()
  sessionID: string;

  @IsEmpty()
  username: string;

  @IsEmpty()
  lastSeen: string;

  @IsEmpty()
  status: number;

  @IsEmpty()
  friends: userDto[];

  @IsEmpty()
  rooms: Room[];

  @IsEmpty()
  notifications: Notification[];
}

export class userRoomDto {
  @IsNumber()
  id: number;
}
