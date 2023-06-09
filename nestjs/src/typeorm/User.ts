import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Game } from './Game';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  avatar: string;

  @Column({ enum: ['online', 'offline', 'ingame'] })
  status: string;

  // @Column()
  // stats: {
  //   wins: number;
  //   losses: number;
  //   rating: number;
  //   achiments: string[];
  // };

  // @OneToMany((type) => Game, (game) => game.user)
  // games: Game[];
}
