import { IsNumber } from 'class-validator';

export enum notificationTypes {
  FRIEND,
  ROOM,
  GAME,
  KICK,
  BAN,
  MOD,
}

export enum notificationStatus {
  PENDING,
  ACCEPTED,
  DECLINED,
  QUESTION,
}

export class notificationDto {
  @IsNumber()
  id: number;
}
