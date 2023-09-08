import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/User';
import { verifyToken } from 'src/functions/user';
import { userDto } from 'src/types/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async findUsers(token: string) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['friends'],
    });

    const users = await this.userRep.find({ relations: ['friends'] });
    const friends = loginUser.friends;

    return { users, friends };
  }

  async createUser(token: string, friendUserDetails: userDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['friends'],
    });
    const friendUser = await this.userRep.findOne({
      where: { username: friendUserDetails.username },
      relations: ['friends'],
    });

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

    await this.userRep.save(friendUser);
    const user = await this.userRep.save(loginUser);

    return {
      ...user,
      friends: [
        ...user.friends.map((friend) => {
          return { ...friend, friends: undefined };
        }),
      ],
    };
  }

  async deleteUser(token: string, friendUserDetails: userDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['friends'],
    });
    const friendUser = await this.userRep.findOne({
      where: { username: friendUserDetails.username },
      relations: ['friends'],
    });

    loginUser.friends = loginUser.friends?.filter(
      (friend) => friend.username !== friendUserDetails.username,
    );
    friendUser.friends = friendUser.friends?.filter(
      (friend) => friend.username !== loginUserInfo.username,
    );

    await this.userRep.save(friendUser);
    return this.userRep.save(loginUser);
  }

  async updateUser(token: string, userDetails: userDto) {
    const loginUserInfo = verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['friends'],
    });

    if (!loginUser) throw new HttpException('user not found', 404);
    if (
      userDetails.id !== loginUser.id ||
      loginUser.username !== userDetails.username
    )
      throw new HttpException('id and username cannot be changed', 401);

    return this.userRep.save({ ...loginUser, ...userDetails });
  }
}
