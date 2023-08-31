import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Room } from './Room';
// import { Game } from './Game';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  sessionID: string;

  @Column({ default: 'https://source.unsplash.com/featured/300x202' })
  avatar: string;

  @Column({ enum: ['online', 'offline', 'ingame'] })
  status: string;

  @Column({
    default: new Date().toLocaleString('tr-TR', {
      timeZone: 'Europe/Istanbul',
    }),
  })
  lastSeen: string;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => Room, (room) => room.users)
  @JoinTable()
  rooms: Room[];

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
