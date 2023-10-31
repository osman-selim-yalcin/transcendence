import { IsOptional, IsString } from 'class-validator';

export class twoFactorDto {
  @IsOptional()
  @IsString()
  base32: string;

  @IsString()
  token: string;
}
