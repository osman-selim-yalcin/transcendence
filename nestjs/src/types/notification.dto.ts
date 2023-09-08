import { IsNotEmpty } from 'class-validator';
import { User } from 'src/typeorm/User';

export class notificationDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  content: string;

  createdAt: string;
  creator: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  user: User;
}
