import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/typeorm/User';
import { addFriendHelper, deleteFriendHelper } from 'src/functions/user';
import { userDto } from 'src/types/user.dto';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

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

  async handleStatusChange(user: User, status: string) {
    user.status = status;
    return this.userRep.save(user);
  }

  async findUserBySessionID(sessionID: string) {
    return this.userRep.findOne({ where: { sessionID: sessionID } });
  }
}
