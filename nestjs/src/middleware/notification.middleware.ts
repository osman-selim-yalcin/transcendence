import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    if (!req.friendUser)
      throw new HttpException('notification need friendUser', 400);
    const notification = await this.isNotificationExist(
      req.user,
      req.friendUser,
    );
    await this.notificationRep.remove(notification);
    next();
  }

  async isNotificationExist(loginUser: User, friendUser: User) {
    const notification = loginUser.notifications?.find(
      (n) =>
        n.type === notificationTypes.FRIEND && n.creator.id === friendUser.id,
    );
    if (!notification) throw new HttpException('u need notification', 400);
    return notification;
  }
}
