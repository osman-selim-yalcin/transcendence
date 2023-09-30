import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/typeorm/User';
import { verifyToken } from 'src/functions/user';
import { userDto } from 'src/types/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async allUsers(query: any, params: any) {
    if (params.take > 50) throw new HttpException('too many users', 400);
    const users = await this.userRep.find({
      skip: params.skip ? params.skip : 0,
      take: params.take ? params.take : '',
      where: { username: Like((query.q ? query.q : '') + '%') },
      relations: ['friends', 'notifications'],
    });
    return users;
  }

  async getFriends(token: string) {
    const loginUser = await this.tokenToUser(token, ['friends']);
    return loginUser.friends;
  }

  async addFriend(token: string, friendUserDetails: userDto) {
    const loginUser = await this.tokenToUser(token, ['friends']);
    const friendUser = await this.idToUser(friendUserDetails.id, ['friends']);

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
    await this.userRep.save(friendUser);
    return { msg: 'success' };
  }

  async deleteFriend(token: string, friendUserDetails: userDto) {
    const loginUser = await this.tokenToUser(token, ['friends']);
    const friendUser = await this.idToUser(friendUserDetails.id, ['friends']);

    loginUser.friends = loginUser.friends?.filter(
      (friend) => friend.id !== friendUserDetails.id,
    );
    friendUser.friends = friendUser.friends?.filter(
      (friend) => friend.id !== loginUser.id,
    );

    await this.userRep.save(loginUser);
    await this.userRep.save(friendUser);
    return { msg: 'success' };
  }

  async updateUser(token: string, userDetails: userDto) {
    const loginUser = await this.tokenToUser(token);
    if (userDetails.id !== loginUser.id)
      throw new HttpException('id cannot be changed', 401);

    await this.userRep.save({ ...loginUser, ...userDetails });
    return { msg: 'success' };
  }

  async getUserInfo(token: string) {
    return this.tokenToUser(token);
  }

  //ENDPOINT END HERE / UTILS START HERE

  async handleStatusChange(user: User, status: string) {
    user.status = status;
    return this.userRep.save(user);
  }

  async findUserBySessionID(sessionID: string) {
    return this.userRep.findOne({ where: { sessionID: sessionID } });
  }

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
}
