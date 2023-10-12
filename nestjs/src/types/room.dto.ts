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
import { userDto, userRoomDto } from './user.dto';
import { Type } from 'class-transformer';

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
  users: userDto[];

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
}

// export class roomCommands {
//   @IsNotEmpty()
//   id: number;

//   @IsNotEmpty()
//   user: User;
// }
