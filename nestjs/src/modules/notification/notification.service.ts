import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUserInRoom } from 'src/functions/room';
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

  async createNotification(user: User, details: notificationDto) {
    const otherUser = await this.idToUser(details.user.id, [
      'notifications',
      'notifications.user',
      'notifications.creator',
      'rooms',
      'rooms.users',
    ]);

    otherUser.notifications?.map((n) => {
      if (n.type === details.type && n.creator.id === user.id) {
        throw new HttpException('already exist', 400);
      }
    });
    if (otherUser.id === user.id) throw new HttpException('same user', 400);

    if (details.type === notificationTypes.FRIEND) {
      otherUser.friends?.map((f) => {
        if (f.id === user.id) throw new HttpException('already friend', 400);
      });
      // } else if (details.type === notificationTypes.ROOM) {
      //   otherUser.rooms?.map((r) => {
      //     if (isUserInRoom(r, user))
      //       throw new HttpException('already in room', 400);
      //   });
    } else {
      throw new HttpException('friend only', 400);
    }

    const notification = this.notificationRep.create({
      content: details.content,
      creator: user,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      user: otherUser,
      type: details.type,
    });
    await this.notificationRep.save(notification);
    const siblingNotificaiton = this.notificationRep.create({
      content: details.content,
      creator: otherUser,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      user: user,
      type: notificationTypes.PENDING,
      sibling: notification,
    });
    await this.notificationRep.save(siblingNotificaiton);
    notification.sibling = siblingNotificaiton;
    await this.notificationRep.save(notification);

    return { msg: 'success' };
  }

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

  // This function is used to send notification to user

  async idToUser(id: number, relations?: string[]) {
    const user = await this.userRep.findOne({
      where: { id: id },
      relations: relations || [],
    });
    if (!user) throw new HttpException('user not found', 404);
    return user;
  }
}
