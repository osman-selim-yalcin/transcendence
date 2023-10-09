import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { notificationTypes } from 'src/types/notification.dto';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  content: number;

  @Column()
  createdAt: string;

  @Column({
    type: 'enum',
    enum: notificationTypes,
  })
  type: number;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @OneToOne(() => Notification, (notification) => notification.sibling, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  sibling: Notification;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
