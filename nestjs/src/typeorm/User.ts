import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Room } from './Room';
import { Notification } from './Notification';
import { userStatus } from 'src/types/user.dto';
import { Game } from './Game';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: true })
  displayName: string;

  @Column({ nullable: false })
  sessionID: string;

  @Column({ nullable: true })
  twoFactorSecret: string;

  @Column({ nullable: true })
  twoFactorEnabled: boolean;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({
    default:
      'https://res.cloudinary.com/dzhczcggz/image/upload/v1698681962/transcendence/mbmjyryi4wceu2xjehj9.jpg',
  })
  avatar: string;

  @Column({ nullable: true })
  oldAvatar: string;

  @Column({ type: 'enum', enum: userStatus, default: userStatus.OFFLINE })
  status: number;

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastSeen: string;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

  @Column('jsonb', { array: false, nullable: false, default: [] })
  blockList: { blockingUser: string; blockedUser: string }[];

  @ManyToMany(() => Room, (room) => room.users, { cascade: true })
  @JoinTable()
  rooms: Room[];

  @OneToMany(() => Notification, (notification) => notification.user)
  @JoinColumn()
  notifications: Notification[];

  @Column({ default: 1500 })
  elo: number;

  @OneToMany(() => Game, (game) => game.winner)
  won: Game[];

  @OneToMany(() => Game, (game) => game.loser)
  lost: Game[];
}
