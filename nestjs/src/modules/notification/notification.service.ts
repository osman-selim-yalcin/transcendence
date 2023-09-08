import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verifyToken } from 'src/functions/user';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async createNotification(token: string, details: any) {
    const loginUserInfo = verifyToken(token);
    const owner = loginUserInfo.username;
    const user = await this.userRep.findOne({
      where: { username: details.username },
      relations: ['notifications'],
    });

    user.notifications?.map((n) => {
      if (n.type === details.type && n.owner === owner) {
        throw new HttpException('already exist', 400);
      }
    });

    if (user.username === owner) throw new HttpException('same user', 400);

    const notification = this.notificationRep.create({
      content: details.content,
      owner,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      user,
      type: details.type,
    });
    if (!user.notifications) user.notifications = [notification];
    else user.notifications.push(notification);
    await this.userRep.save(user);
    return this.notificationRep.save(notification);
  }

  async getNotifications(token: string) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['notifications'],
    });
    return loginUser.notifications;
  }

  async deleteNotification(id: number) {
    const notification = await this.notificationRep.findOne({ where: { id } });
    return this.notificationRep.delete({ id: notification.id });
  }
}
