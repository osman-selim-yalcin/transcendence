import { IsNumber, IsString } from 'class-validator';

export enum userStatus {
  ONLINE,
  OFFLINE,
  INGAME,
  AWAY,
  BUSY,
  BLOCKED,
}

export class userDto {
  @IsString()
  displayName: string;
}

export class userRoomDto {
  @IsNumber()
  id: number;
}
