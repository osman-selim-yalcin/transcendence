import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Message } from 'src/typeorm/Message';
import { User } from 'src/typeorm/User';

export class roomDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  users: User[];

  @IsNotEmpty()
  isGroup: boolean;

  @IsNotEmpty()
  name: string;

  password: string;
  avatar: string;
  isInviteOnly: boolean;

  @IsEmpty()
  messages: Message[];
  @IsEmpty()
  createdAt: string;
  @IsEmpty()
  creator: string;
  @IsEmpty()
  mods: string[];
  @IsEmpty()
  banList: string[];
  @IsEmpty()
  inviteList: string[];
}

export class roomCommands {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user: User;
}
