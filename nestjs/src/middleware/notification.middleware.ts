import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isFriend } from 'src/functions/user';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import {
  notificationStatus,
  notificationTypes,
} from 'src/types/notification.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async use(req: any, res: any, next: () => void) {
    if (isFriend(req.user, req.friendUser))
      throw new HttpException('already friend', 400);

    const notification = await this.isFriendNotificationExist(
      req.user,
      req.friendUser,
      notificationStatus.QUESTION,
    );
    if (notification) {
      await this.notificationRep.save({
        ...notification,
        status: notificationStatus.ACCEPTED,
        user: notification.creator,
        creator: notification.user,
      });
      await this.notificationRep.remove(notification);
      return next();
    }
    const newNotification = await this.isFriendNotificationExist(
      req.user,
      req.friendUser,
      notificationStatus.PENDING,
    );
    if (newNotification) throw new HttpException('already sent', 400);
    await this.createNotifcations(req.user, req.friendUser);
  }

  async isFriendNotificationExist(
    loginUser: User,
    friendUser: User,
    status: notificationStatus,
  ) {
    const notification = loginUser.notifications?.find(
      (n) =>
        n.type === notificationTypes.FRIEND &&
        n.creator.id === friendUser.id &&
        n.status === status,
    );
    return notification;
  }

  async createNotifcations(user: User, friendUser: User) {
    const notification = await this.notificationRep.save({
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      type: notificationTypes.FRIEND,
      status: notificationStatus.QUESTION,
      creator: user,
      user: friendUser,
    });
    const siblingNotificaiton = await this.notificationRep.save({
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      creator: friendUser,
      user: user,
      type: notificationTypes.FRIEND,
      status: notificationStatus.PENDING,
      sibling: notification,
    });
    notification.sibling = siblingNotificaiton;
    await this.notificationRep.save(notification);
    throw new HttpException('notification created succesfully', 200);
  }
}
