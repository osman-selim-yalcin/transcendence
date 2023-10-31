import {
  IsArray,
  IsBoolean,
  IsEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Message } from 'src/typeorm/Message';
import { userRoomDto } from './user.dto';
import { Type } from 'class-transformer';
import { User } from 'src/typeorm/User';

export class roomDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isGroup: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => userRoomDto)
  users: User[];

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsBoolean()
  @IsOptional()
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
  muteList: { username: string; time: number }[];
}
