import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'sessions' })
export class Session {
  @PrimaryColumn()
  id: string;

  @Column()
  userID: string;

  @Column()
  username: string;

  @Column()
  connected: boolean;
}
