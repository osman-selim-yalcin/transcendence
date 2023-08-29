import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './Room';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  createdAt: string;

  @Column()
  owner: string;

  @ManyToOne((type) => Room, (room) => room.messages)
  room: Room;
}
