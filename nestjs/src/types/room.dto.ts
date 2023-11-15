import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
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

  @IsBoolean()
  @IsOptional()
  isInviteOnly: boolean;
}
