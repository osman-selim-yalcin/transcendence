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

export type muteType = {
  username: string;
  time: NodeJS.Timeout;
};

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.rooms, { onDelete: 'CASCADE' })
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

  @Column({
    default:
      'https://res.cloudinary.com/dzhczcggz/image/upload/v1698681962/transcendence/mbmjyryi4wceu2xjehj9.jpg',
  })
  avatar: string;

  @Column({ nullable: true })
  creator: string;

  @Column('text', { array: true, nullable: true, default: [] })
  mods: string[];

  @Column('text', { array: true, nullable: true, default: [] })
  banList: string[];

  @Column('jsonb', { array: false, nullable: false, default: [] })
  muteList: muteType[];

  @Column({ default: false })
  isGroup: boolean;

  @Column({ default: false })
  isInviteOnly: boolean;
}
