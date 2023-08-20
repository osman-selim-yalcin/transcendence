import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Chat } from 'src/typeorm/Chat';
import { User } from 'src/typeorm/User';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Chat) private chatRep: Repository<Chat>,
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
    const loginUserInfo = this.verifyToken(token);

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
    const loginUserInfo = this.verifyToken(token);
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

  async startChat(token: string, friendname: string) {
    const loginUserInfo = this.verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });
    const friendUser = await this.userRep.findOneBy({ username: friendname });
    const chatDeatils = {
      users: [friendUser, loginUser],
    };
    let chat = await this.chatRep.findOne({
      relations: ['users'],
      where: { users: [friendUser] },
    });
    if (chat) return chat.id;
    chat = this.chatRep.create(chatDeatils);
    await this.chatRep.save(chat);
    return chat.id;
  }

  async findChat(chatId: number) {
    return this.chatRep.findOne({
      where: { id: chatId },
      relations: ['messages', 'users'],
    });
  }

  verifyToken(token: string) {
    return jwt.verify(
      token,
      this.config.get('accessTokenSecret'),
      (err, decoded) => {
        if (err) {
          return false;
        }
        return decoded;
      },
    );
  }
}
