import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verifyToken } from 'src/functions/token';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import { notificationDto, notificationTypes } from 'src/types/notification.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
  ) {}

  async createNotification(token: string, details: notificationDto) {
    const creator = await this.tokenToUser(token);
    const user = await this.idToUser(details.user.id, [
      'notifications',
      'notifications.creator',
    ]);

    user.notifications?.map((n) => {
      if (n.type === details.type && n.creator.id === creator.id) {
        throw new HttpException('already exist', 400);
      }
    });
    if (user.id === creator.id) throw new HttpException('same user', 400);

    if (details.type === notificationTypes.FRIEND) {
      user.friends?.map((f) => {
        if (f.id === creator.id) throw new HttpException('already friend', 400);
      });
    } else {
      throw new HttpException('only add friend notification (tmp)', 400);
    }

    const notification = await this.notificationRep.create({
      content: details.content,
      creator: creator,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      user,
      type: details.type,
    });
    await this.notificationRep.save(notification);

    const siblingNotificaiton = await this.notificationRep.create({
      content: details.content,
      creator: user,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      user: creator,
      type: notificationTypes.PENDING,
      sibling: notification,
    });

    await this.notificationRep.save(siblingNotificaiton);
    notification.sibling = siblingNotificaiton;
    await this.notificationRep.save(notification);
    return { msg: 'success' };
  }

  async getNotifications(token: string) {
    const loginUser = await this.tokenToUser(token, [
      'notifications',
      'notifications.creator',
    ]);
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

  // This function is used to send notification to user
  async tokenToUser(token: string, relations?: string[]) {
    const loginUserInfo = verifyToken(token);
    return this.userRep.findOne({
      where: { id: loginUserInfo.id },
      relations: relations || [],
    });
  }

  async idToUser(id: number, relations?: string[]) {
    const user = await this.userRep.findOne({
      where: { id: id },
      relations: relations || [],
    });
    if (!user) throw new HttpException('user not found', 404);
    return user;
  }

  async isNotificationExist(
    user: User,
    notificationDetails: notificationDto,
    creator: User,
  ) {
    user.notifications?.map((n) => {
      if (n.type === notificationDetails.type && n.creator.id === creator.id) {
        throw new HttpException('already exist', 400);
      }
    });
    if (user.id === creator.id) throw new HttpException('same user', 400);
  }
}
