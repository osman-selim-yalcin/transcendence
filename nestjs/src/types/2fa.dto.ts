import { IsOptional, IsString } from 'class-validator';

export class twoFactorDto {
  @IsString()
  token: string;
}
