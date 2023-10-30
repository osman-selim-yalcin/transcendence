import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { notificationModify } from 'src/functions/notification';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import {
  notificationDto,
  notificationStatus,
  notificationTypes,
} from 'src/types/notification.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async getNotifications(user: User) {
    // return user.notifications.map((n) => notificationModify(n));
    return this.notificationRep.find({
      relations: ['user', 'creator', 'sibling'],
    });
  }

  async deleteNotification(user: User, notificationDetails: notificationDto) {
    const notification = await this.notificationRep.findOne({
      where: { id: notificationDetails.id },
      relations: ['user', 'creator'],
    });
    if (!notification) throw new HttpException('not found', 404);
    console.log(notification);
    if (notification.user.id !== user.id)
      throw new HttpException('not authorized', 401);
    if (notification.status === notificationStatus.QUESTION) {
      let content = '';
      if (notification.type === notificationTypes.FRIEND) {
        content = 'Friend request declined by ' + notification.user.username;
      } else if (notification.type === notificationTypes.ROOM) {
        content = 'Room invitation declined by ' + notification.user.username;
      } else if (notification.type === notificationTypes.GAME) {
        content = 'Game invitation declined by ' + notification.user.username;
      }

      await this.notificationRep.save({
        type: notification.type,
        content: content,
        status: notificationStatus.DECLINED,
        user: notification.creator,
        creator: notification.user,
      });
    }
    await this.notificationRep.remove(notification);
    return { msg: 'success' };
  }
}
