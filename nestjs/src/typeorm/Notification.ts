import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  createdAt: string;

  @Column()
  creator: string;

  @Column()
  type: string;

  @ManyToOne((type) => User, (user) => user.notifications)
  user: User;
}
