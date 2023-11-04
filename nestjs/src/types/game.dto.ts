import { IsNumber } from 'class-validator';
import { User } from 'src/typeorm/User';

export type typeGame = {
  winner: User;
  loser: User;
  elo: number;
  score: number[];
};

export class gameDto {
  @IsNumber()
  id: number;
}
