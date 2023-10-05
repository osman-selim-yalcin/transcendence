import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from 'src/typeorm/User';

export enum notificationTypes {
  FRIEND = 'addFriend',
  ROOM = 'inviteRoom',
  GAME = 'inviteGame',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export enum notificationTypesBody {
  FRIEND = 'addFriend',
  ROOM = 'inviteRoom',
  GAME = 'inviteGame',
}

export class notificationDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  content: string;

  createdAt: string;
  creator: User;

  @IsNotEmpty()
  @IsEnum(notificationTypesBody)
  type: notificationTypes;

  @IsNotEmpty()
  user: User;
}
