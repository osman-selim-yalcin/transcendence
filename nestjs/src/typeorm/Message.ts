import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Chat } from './Chat';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryColumn()
  msg: string;

  @Column()
  createdAt: Date;

  @ManyToOne((type) => Chat, (chat) => chat.messages)
  chat: Chat;
}
