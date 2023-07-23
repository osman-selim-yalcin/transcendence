import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
// import { Game } from './Game';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  avatar: string;

  @Column({ enum: ['online', 'offline', 'ingame'] })
  status: string;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

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
