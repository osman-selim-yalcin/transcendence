import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  @Inject(ConfigService)
  public config: ConfigService;

  findUsers() {
    return this.userRep.find({ relations: ['friends'] });
  }

  async allFriends(token: string) {
    const user = await this.userRep.findOne({
      where: { username: jwt.decode(token)['username'] },
      relations: ['friends'],
    });
    return user.friends;
  }

  tmpCreate(userDetails: any) {
    const newUser = this.userRep.create(userDetails);
    return this.userRep.save(newUser);
  }

  async addfriend(token: string, friendname: string) {
    //tmp
    const loginUserInfo = jwt.verify(
      token,
      this.config.get('accessTokenSecret'),
      (err, decoded) => {
        if (err) {
          return null;
        }
        return decoded;
      },
    );
    //tmp

    const friendUser = await this.userRep.findOneBy({ username: friendname });
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: {
        friends: true,
      },
    });
    if (!loginUser.friends) loginUser.friends = [friendUser];
    else loginUser.friends.push(friendUser);
    return this.userRep.save(loginUser);
  }

  async removeFriend(token: string, friendname: string) {
    //tmp
    const loginUserInfo = jwt.verify(
      token,
      this.config.get('accessTokenSecret'),
      (err, decoded) => {
        if (err) {
          return null;
        }
        return decoded;
      },
    );
    //tmp

    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: {
        friends: true,
      },
    });
    loginUser.friends = loginUser.friends?.filter(
      (friend) => friend.username !== friendname,
    );
    return this.userRep.save(loginUser);
  }

  verifyToken(token: string) {
    return jwt.verify(
      token,
      this.config.get('accessTokenSecret'),
      (err, decoded) => {
        if (err) {
          return false;
        }
        return true;
      },
    );
  }
}
