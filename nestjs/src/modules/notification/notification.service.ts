import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import { notificationDto } from 'src/types/notification.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async getNotifications(user: User) {
    const allnot = await this.notificationRep.find({
      relations: ['creator', 'user', 'sibling'],
    });
    return allnot;
  }

  async deleteNotification(notificationDetails: notificationDto) {
    const notification = await this.notificationRep.findOne({
      where: { id: notificationDetails.id },
    });
    if (!notification) throw new HttpException('not found', 404);
    await this.notificationRep.remove(notification);
    return { msg: 'success' };
  }
}
