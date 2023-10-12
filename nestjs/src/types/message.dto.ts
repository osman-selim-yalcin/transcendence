import { IsNumber, IsString } from 'class-validator';

export class messageDto {
  @IsString()
  content: string;

  @IsNumber()
  id: number;
}
