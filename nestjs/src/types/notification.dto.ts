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

export enum notificationTypesBody {
  FRIEND,
  ROOM,
  GAME,
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

  @IsEmpty()
  content: number;

  @IsEmpty()
  createdAt: string;
  @IsEmpty()
  creator: User;

  @IsNotEmpty()
  @IsEnum(notificationTypesBody)
  type: notificationTypes;

  @IsNotEmpty()
  user: User;
}
