import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Message } from 'src/typeorm/Message';
import { User } from 'src/typeorm/User';

export class roomDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  users: User[];

  messages: Message[];

  @IsNotEmpty()
  createdAt: string;

  password: string;

  @IsNotEmpty()
  name: string;

  avatar: string;

  @IsNotEmpty()
  creator: string;

  mods: string[];
  banlist: string[];
  isInviteOnly: boolean;
  inviteList: string[];

  @IsNotEmpty()
  isGroup: boolean;
}
