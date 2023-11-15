import { User } from 'src/typeorm/User';

export type typeGame = {
  winner: User;
  loser: User;
  elo: number;
  score: number[];
};

export type gameDto = {
  id: string;
};
