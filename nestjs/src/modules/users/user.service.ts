import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/typeorm/User';
import {
  addFriendHelper,
  blockUserHelper,
  deleteFriendHelper,
  isFriend,
  modifyBlockUser,
} from 'src/functions/user';
import { userDto } from 'src/types/user.dto';
import {
  notificationStatus,
  notificationTypes,
} from 'src/types/notification.dto';
import { Notification } from 'src/typeorm/Notification';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
    @InjectRepository(User) private userRep: Repository<User>,
  ) {}

  async allUsers(query: any, user: User) {
    if (query.take > 50) throw new HttpException('too many users', 400);
    let users = await this.userRep.find({
      skip: query.skip ? query.skip : 0,
      take: query.take ? query.take : '',
      where: { username: Like((query.q ? query.q : '') + '%') },
    });
    users = users?.map((u) => {
      if (user.blocked.find((f) => f.id === u.id)) return modifyBlockUser(u);
      else return u;
    });
    return users;
  }

  async getFriends(user: User) {
    return user.friends;
  }

  async addFriend(user: User, otherUser: User) {
    const notification = await this.notificationHandler(user, otherUser);
    addFriendHelper(user, otherUser);
    await this.userRep.save(user);
    await this.userRep.save(otherUser);
    await this.notificationRep.save({
      type: notification.type,
      content: `${user.username} accepted your friend request`,
      status: notificationStatus.ACCEPTED,
      user: notification.creator,
      creator: notification.user,
    });
    await this.notificationRep.remove(notification);
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

  async blockUser(user: User, otherUser: User) {
    blockUserHelper(user, otherUser);
    await this.userRep.save(user);
    await this.userRep.save(otherUser);
    return { msg: 'success' };
  }

  //ENDPOINT END HERE / UTILS START HERE

  async handleStatusChange(user: User, status: number) {
    user = await this.userRep.findOne({
      where: { id: user.id },
    });
    user.status = status;
    return this.userRep.save(user);
  }

  async findUserBySessionID(sessionID: string, relations?: string[]) {
    return this.userRep.findOne({
      where: { sessionID: sessionID },
      relations,
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
      return notification;
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
      content: `${user.username} wants to be your friend`,
      type: notificationTypes.FRIEND,
      status: notificationStatus.QUESTION,
      creator: user,
      user: friendUser,
    });
    const siblingNotificaiton = await this.notificationRep.save({
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

  async updateAvatar(user: User, cloudinaryResponse: CloudinaryResponse) {
    user.avatar = cloudinaryResponse.secure_url;
    user.oldAvatar = cloudinaryResponse.public_id;
    await this.userRep.save(user);
    throw new HttpException('avatar updated succesfully', 200);
  }
}
