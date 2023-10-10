import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/typeorm/User';
import {
  addFriendHelper,
  deleteFriendHelper,
  isFriend,
} from 'src/functions/user';
import { userDto } from 'src/types/user.dto';
import {
  notificationStatus,
  notificationTypes,
} from 'src/types/notification.dto';
import { Notification } from 'src/typeorm/Notification';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
    @InjectRepository(User) private userRep: Repository<User>,
  ) {}

  async allUsers(query: any) {
    if (query.take > 50) throw new HttpException('too many users', 400);
    const users = await this.userRep.find({
      skip: query.skip ? query.skip : 0,
      take: query.take ? query.take : '',
      where: { username: Like((query.q ? query.q : '') + '%') },
      relations: ['friends', 'notifications', 'notifications.creator'],
    });
    return users;
  }

  async getFriends(user: User) {
    return user.friends;
  }

  async addFriend(user: User, otherUser: User) {
    await this.notificationHandler(user, otherUser);
    addFriendHelper(user, otherUser);
    await this.userRep.save(user);
    await this.userRep.save(otherUser);
    return { msg: 'success' };
  }

  async deleteFriend(user: User, otherUser: User) {
    deleteFriendHelper(user, otherUser);
    await this.userRep.save(user);
    await this.userRep.save(otherUser);
    return { msg: 'success' };
  }

  async updateUser(user: User, userDetails: userDto) {
    if (userDetails.id !== user.id)
      throw new HttpException('id cannot be changed', 401);

    await this.userRep.save({ ...user, ...userDetails });
    return { msg: 'success' };
  }

  async getUserInfo(user: User) {
    return user;
  }

  //ENDPOINT END HERE / UTILS START HERE

  async handleStatusChange(user: User, status: number) {
    user = await this.userRep.findOne({
      where: { id: user.id },
    });
    user.status = status;
    return this.userRep.save(user);
  }

  async findUserBySessionID(sessionID: string) {
    return this.userRep.findOne({
      where: { sessionID: sessionID },
      relations: ['rooms'],
    });
  }

  async notificationHandler(user: User, otherUser: User) {
    if (isFriend(user, otherUser))
      throw new HttpException('already friend', 400);

    const notification = await this.isFriendNotificationExist(
      user,
      otherUser,
      notificationStatus.QUESTION,
    );
    if (notification) {
      await this.notificationRep.save({
        ...notification,
        status: notificationStatus.ACCEPTED,
        user: notification.creator,
        content: `${user.username} accepted your friend request`,
        creator: notification.user,
      });
      await this.notificationRep.remove(notification);
      return;
    }
    const newNotification = await this.isFriendNotificationExist(
      user,
      otherUser,
      notificationStatus.PENDING,
    );
    if (newNotification) throw new HttpException('already sent', 400);
    await this.createNotifcations(user, otherUser);
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
      content: `${user.username} wants to be your friend`,
      type: notificationTypes.FRIEND,
      status: notificationStatus.QUESTION,
      creator: user,
      user: friendUser,
    });
    const siblingNotificaiton = await this.notificationRep.save({
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      content: `Waiting for ${friendUser.username} to accept your friend request`,
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
