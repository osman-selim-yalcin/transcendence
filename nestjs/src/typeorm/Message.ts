import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './Room';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column()
  owner: string;

  @ManyToOne((type) => Room, (room) => room.messages)
  room: Room;
}
