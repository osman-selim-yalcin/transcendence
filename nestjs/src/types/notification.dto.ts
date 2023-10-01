import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from 'src/typeorm/User';

export enum notificationTypes {
  FRIEND = 'addFriend',
  INVITE = 'inviteRoom',
  PENDING = 'pending',
}

export class notificationDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  content: string;

  createdAt: string;
  creator: User;

  @IsNotEmpty()
  @IsEnum(notificationTypes)
  type: notificationTypes;

  @IsNotEmpty()
  user: User;
}
