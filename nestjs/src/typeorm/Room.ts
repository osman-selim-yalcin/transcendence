import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
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

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinColumn()
  users: User[];

  @OneToMany(() => Message, (message) => message.room)
  @JoinColumn()
  messages: Message[];

  @Column()
  createdAt: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: 'https://source.unsplash.com/featured/300x202' })
  avatar: string;

  @Column({ nullable: true })
  creator: string;

  @Column({ array: true, nullable: true })
  mods: string;

  @Column({ array: true, nullable: true })
  banlist: string;

  @Column({ default: false })
  isGroup: boolean;

  @Column({ default: false })
  isInviteOnly: boolean;
}
