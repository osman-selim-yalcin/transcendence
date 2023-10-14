import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.rooms, { cascade: true })
  @JoinColumn()
  users: User[];

  @OneToMany(() => Message, (message) => message.room, { cascade: true })
  @JoinColumn()
  messages: Message[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  name: string;

  @Column({ default: 'https://source.unsplash.com/featured/300x202' })
  avatar: string;

  @Column({ nullable: true })
  creator: string;

  @Column('text', { array: true, nullable: true, default: [] })
  mods: string[];

  @Column('text', { array: true, nullable: true, default: [] })
  banList: string[];

  @Column('jsonb', { array: false, nullable: true, default: [] })
  muteList: { username: string; time: number }[];

  @Column({ default: false })
  isGroup: boolean;

  @Column({ default: false })
  isInviteOnly: boolean;
}
