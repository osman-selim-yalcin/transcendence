import { ConfigService } from '@nestjs/config';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';
import { Message } from 'src/typeorm/Message';
import { verifyToken } from 'src/functions/user';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
    @InjectRepository(Message) private messageRep: Repository<Message>,
  ) {}

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

  async addfriend(token: string, friendname: string) {
    const loginUserInfo = verifyToken(token);

    const friendUser = await this.userRep.findOneBy({ username: friendname });
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
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

    if (!loginUser.friends) loginUser.friends = [friendUser];
    else loginUser.friends.push(friendUser);

    if (!friendUser.friends) friendUser.friends = [loginUser];
    else friendUser.friends.push(loginUser);

    await this.userRep.save(friendUser);
    await this.userRep.save(loginUser);
    return { status: 'ok' };
  }

  async removeFriend(token: string, friendname: string) {
    const loginUserInfo = verifyToken(token);
    const friendUser = await this.userRep.findOne({
      where: { username: friendname },
      relations: ['friends'],
    });
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['friends'],
    });
    loginUser.friends = loginUser.friends?.filter(
      (friend) => friend.username !== friendname,
    );
    friendUser.friends = friendUser.friends?.filter(
      (friend) => friend.username !== loginUserInfo.username,
    );

    await this.userRep.save(friendUser);
    return this.userRep.save(loginUser);
  }

  async createMsg(details: any) {
    const room = await this.roomRep.findOne({
      relations: ['messages'],
      where: { id: details.roomID },
    });
    const msg = this.messageRep.create({
      owner: details.owner,
      content: details.msg,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      room,
    });

    if (!room.messages) room.messages = [msg];
    else room.messages.push(msg);

    await this.roomRep.save(room);
    return this.messageRep.save(msg);
  }
}
