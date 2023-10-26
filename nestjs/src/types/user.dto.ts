import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Game } from 'src/typeorm/Game';
import { Notification } from 'src/typeorm/Notification';
import { Room } from 'src/typeorm/Room';

export enum userStatus {
  ONLINE,
  OFFLINE,
  INGAME,
  AWAY,
  BUSY,
  BLOCKED,
}

export class userDto {
  @IsEmpty()
  avatar: string;

  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  displayName: string;

  @IsEmpty()
  createdAt: string;

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

  @IsEmpty()
  blocked: userDto[];

  @IsEmpty()
  elo: number;

  @IsEmpty()
  won: Game[];

  @IsEmpty()
  lost: Game[];

  @IsEmpty()
  oldAvatar: string;
}

export class userRoomDto {
  @IsNumber()
  id: number;
}
