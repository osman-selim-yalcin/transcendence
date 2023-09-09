import { IsEmpty, IsNotEmpty, ValidateNested } from 'class-validator';
import { Message } from 'src/typeorm/Message';
import { User } from 'src/typeorm/User';

export class roomDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  users: User[];

  @IsEmpty()
  @ValidateNested({ each: true })
  messages: Message[];

  @IsEmpty()
  createdAt: string;

  password: string;

  @IsNotEmpty()
  name: string;

  avatar: string;

  @IsEmpty()
  creator: string;

  mods: string[];
  banList: string[];
  isInviteOnly: boolean;
  inviteList: string[];

  @IsNotEmpty()
  isGroup: boolean;
}
