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

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.chats)
  @JoinColumn()
  users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  @JoinColumn()
  messages: Message[];

  // @Column()
  // createdAt: Date;
}
