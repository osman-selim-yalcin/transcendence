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
  @IsOptional()
  @IsString()
  displayName: string;
}

export class userRoomDto {
  @IsNumber()
  id: number;
}
