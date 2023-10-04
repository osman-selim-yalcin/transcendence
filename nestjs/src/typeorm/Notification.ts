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

  @Column()
  content: string;

  @Column()
  createdAt: string;

  @OneToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column({
    type: 'enum',
    enum: notificationTypes,
    default: notificationTypes.FRIEND,
  })
  type: string;

  @OneToOne(() => Notification, (notification) => notification.sibling, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  sibling: Notification;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
