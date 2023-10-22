import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Room } from './Room';
import { Notification } from './Notification';
import { userStatus } from 'src/types/user.dto';
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

  @Column({ type: 'enum', enum: userStatus, default: userStatus.OFFLINE })
  status: number;

  @Column({
    default: new Date().toLocaleString('tr-TR', {
      timeZone: 'Europe/Istanbul',
    }),
  })
  lastSeen: string;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => User, (user) => user.blocked)
  @JoinTable()
  blocked: User[];

  @ManyToMany(() => Room, (room) => room.users, { cascade: true })
  @JoinTable()
  rooms: Room[];

  @OneToMany(() => Notification, (notification) => notification.user)
  @JoinColumn()
  notifications: Notification[];

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
