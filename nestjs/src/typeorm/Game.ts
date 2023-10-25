import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'games' })
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ nullable: false })
  elo: number;

  @Column('int', { array: true })
  score: number[];

  @ManyToOne(() => User, (user) => user.won, { onDelete: 'CASCADE' })
  @JoinColumn()
  winner: User;

  @ManyToOne(() => User, (user) => user.lost, { onDelete: 'CASCADE' })
  @JoinColumn()
  loser: User;
}
