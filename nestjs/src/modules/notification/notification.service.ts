import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import {
  notificationDto,
  notificationStatus,
} from 'src/types/notification.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async getNotifications(user: User) {
    return user.notifications;
  }

  async deleteNotification(notificationDetails: notificationDto) {
    const notification = await this.notificationRep.findOne({
      where: { id: notificationDetails.id },
    });
    if (!notification) throw new HttpException('not found', 404);
    if (notification.status === notificationStatus.QUESTION) {
      await this.notificationRep.save({
        ...notification,
        status: notificationStatus.DECLINED,
        user: notification.creator,
        creator: notification.user,
      });
    }
    await this.notificationRep.remove(notification);
    return { msg: 'success' };
  }
}
