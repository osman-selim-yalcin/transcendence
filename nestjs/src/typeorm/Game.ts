import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'games' })
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.games)
  // user: User;

  @Column()
  winner: string;

  @Column()
  loser: string;

  @Column()
  date: string;

  @Column()
  winnerScore: number;

  @Column()
  loserScore: number;

  @Column()
  winnerRating: number;

  @Column()
  loserRating: number;

  @Column()
  winnerRatingChange: number;

  @Column()
  loserRatingChange: number;
}
