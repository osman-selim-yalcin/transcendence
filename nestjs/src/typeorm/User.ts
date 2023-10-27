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

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ default: 'https://source.unsplash.com/featured/300x202' })
  avatar: string;

  @Column({ nullable: true })
  oldAvatar: string;

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

  // @Column('jsonb', { array: false, nullable: true, default: [] })
  @Column({ default: 1500 })
  elo: number;

  @OneToMany(() => Game, (game) => game.winner)
  won: Game[];

  @OneToMany(() => Game, (game) => game.loser)
  lost: Game[];
}
