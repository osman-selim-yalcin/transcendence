import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Room } from 'src/typeorm/Room';

export class messageDto {
  @IsNotEmpty()
  content: string;

  createdAt: string;
  owner: string;

  @IsNotEmpty()
  room: Room;
}
