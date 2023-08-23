import {
  Column,
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

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinColumn()
  users: User[];

  @OneToMany(() => Message, (message) => message.room)
  @JoinColumn()
  messages: Message[];

  @Column()
  createdAt: Date;
}
