import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verifyToken } from 'src/functions/user';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import { notificationDto } from 'src/types/notification.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async createNotification(
    token: string,
    notificationDetails: notificationDto,
  ) {
    const loginUserInfo = verifyToken(token);
    const creator = loginUserInfo.username;
    const user = await this.userRep.findOne({
      where: { id: notificationDetails.user.id },
      relations: ['notifications'],
    });

    user.notifications?.map((n) => {
      if (n.type === notificationDetails.type && n.creator === creator) {
        throw new HttpException('already exist', 400);
      }
    });

    if (user.username === creator) throw new HttpException('same user', 400);

    const notification = this.notificationRep.create({
      content: notificationDetails.content,
      creator,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      user,
      type: notificationDetails.type,
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

  async deleteNotification(notificationDetails: notificationDto) {
    const notification = await this.notificationRep.findOne({
      where: { id: notificationDetails.id },
    });
    if (!notification) throw new HttpException('not found', 404);
    return this.notificationRep.delete({ id: notification.id });
  }
}
