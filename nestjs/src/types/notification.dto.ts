import { IsEmpty, IsEnum, IsNotEmpty } from 'class-validator';
import { User } from 'src/typeorm/User';

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
  @IsNotEmpty()
  id: number;
}
