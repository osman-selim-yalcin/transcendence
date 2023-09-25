import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Message } from 'src/typeorm/Message';
import { User } from 'src/typeorm/User';

export class roomDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  users: User[];

  @IsEmpty()
  messages: Message[];

  @IsEmpty()
  createdAt: string;

  password: string;
  @IsNotEmpty()
  name: string;
  avatar: string;
  isInviteOnly: boolean;

  @IsEmpty()
  creator: string;

  @IsEmpty()
  mods: string[];
  @IsEmpty()
  banList: string[];
  @IsEmpty()
  inviteList: string[];

  @IsNotEmpty()
  isGroup: boolean;
}

export class roomCommands {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user: User;
}
