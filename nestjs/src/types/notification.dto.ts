import { IsEmpty, IsEnum, IsNotEmpty } from 'class-validator';
import { User } from 'src/typeorm/User';

export enum notificationTypes {
  FRIEND,
  ROOM,
  GAME,
  PENDING,
  ACCEPTED,
  DECLINED,
}

export enum notificationTypesBody {
  FRIEND,
  ROOM,
  GAME,
}

export class notificationDto {
  @IsNotEmpty()
  id: number;

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
