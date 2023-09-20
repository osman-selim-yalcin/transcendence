import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/User';
import { verifyToken } from 'src/functions/user';
import { currentUser, thirdUser, userDto } from 'src/types/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async allUsers(token: string) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { id: loginUserInfo.id },
      relations: ['friends'],
    });

    const users: thirdUser[] = (await this.userRep.find()).map((user) => {
      return new thirdUser(user);
    });

    const friends: thirdUser[] = loginUser.friends.map((friend) => {
      return new thirdUser(friend);
    });

    return { users, friends };
  }

  async addFriend(token: string, friendUserDetails: userDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { id: loginUserInfo.id },
      relations: ['friends'],
    });
    const friendUser = await this.userRep.findOne({
      where: { id: friendUserDetails.id },
      relations: ['friends'],
    });

    if (!friendUser) throw new HttpException('user not found', 404);

    if (loginUser.id === friendUser.id)
      throw new HttpException('same user', 400);

    if (loginUser.friends) {
      for (const friend of loginUser.friends) {
        if (friend.id === friendUser.id)
          throw new HttpException('already friend', 400);
      }
    }

    loginUser.friends = loginUser.friends
      ? [...loginUser.friends, friendUser]
      : [friendUser];

    friendUser.friends = friendUser.friends
      ? [...friendUser.friends, loginUser]
      : [loginUser];

    await this.userRep.save(loginUser);
    return new thirdUser(await this.userRep.save(friendUser));
  }

  async deleteFriend(token: string, friendUserDetails: userDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { id: loginUserInfo.id },
      relations: ['friends'],
    });
    const friendUser = await this.userRep.findOne({
      where: { id: friendUserDetails.id },
      relations: ['friends'],
    });

    if (!friendUser) throw new HttpException('user not found', 404);

    loginUser.friends = loginUser.friends?.filter(
      (friend) => friend.id !== friendUserDetails.id,
    );
    friendUser.friends = friendUser.friends?.filter(
      (friend) => friend.id !== loginUserInfo.id,
    );

    await this.userRep.save(loginUser);
    return new thirdUser(await this.userRep.save(friendUser));
  }

  async updateUser(token: string, userDetails: userDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { id: loginUserInfo.id },
    });

    if (!loginUser) throw new HttpException('user not found', 404);
    if (userDetails.id !== loginUser.id)
      throw new HttpException('id cannot be changed', 401);

    return new currentUser(
      await this.userRep.save({ ...loginUser, ...userDetails }),
    );
  }

  async getUserInfo(token: string) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { id: loginUserInfo.id },
    });

    return new currentUser(loginUser);
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
