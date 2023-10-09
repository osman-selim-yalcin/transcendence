import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isFriend } from 'src/functions/user';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import { notificationTypes } from 'src/types/notification.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const notification = await this.isNotificationExist(
      req.user,
      req.friendUser,
    );
    if (notification) {
      this.notificationRep.remove(notification);
      return next();
    }
    const newNotification = await this.isNotificationExist(
      req.friendUser,
      req.user,
    );
    if (newNotification) throw new HttpException('already sent', 400);
    isFriend(req.user, req.friendUser);
    await this.createNotifcations(req.user, req.friendUser);
    throw new HttpException('notification created succesfully', 200);
  }

  async isNotificationExist(loginUser: User, friendUser: User) {
    const notification = loginUser.notifications?.find(
      (n) =>
        n.type === notificationTypes.FRIEND && n.creator.id === friendUser.id,
    );
    return notification;
  }

  async createNotifcations(user: User, friendUser: User) {
    const notification = await this.notificationRep.save({
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      type: notificationTypes.FRIEND,
      creator: user,
      user: friendUser,
    });
    const siblingNotificaiton = await this.notificationRep.save({
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      creator: friendUser,
      user: user,
      type: notificationTypes.PENDING,
      sibling: notification,
    });
    notification.sibling = siblingNotificaiton;
    await this.notificationRep.save(notification);
  }
}
