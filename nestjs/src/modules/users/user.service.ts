import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';
import { Message } from 'src/typeorm/Message';

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
    const loginUserInfo = this.verifyToken(token);

    const friendUser = await this.userRep.findOneBy({ username: friendname });
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['friends'],
    });
    if (!loginUser.friends) loginUser.friends = [friendUser];
    else loginUser.friends.push(friendUser);
    return this.userRep.save(loginUser);
  }

  async removeFriend(token: string, friendname: string) {
    const loginUserInfo = this.verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['friends'],
    });
    loginUser.friends = loginUser.friends?.filter(
      (friend) => friend.username !== friendname,
    );
    return this.userRep.save(loginUser);
  }

  async startRoom(token: string, friendname: string) {
    const loginUserInfo = this.verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });
    const friendUser = await this.userRep.findOneBy({ username: friendname });

    const roomDeatils = {
      users: [friendUser, loginUser],
      createdAt: new Date(),
    };

    const tmp = [friendUser.id, loginUser.id];

    const rooms = await this.roomRep.find({
      relations: ['users'],
      where: { users: roomDeatils.users },
    });

    for (const r of rooms) {
      const ids = r.users.map((u) => u.id);
      if (ids.length === 2 && ids.sort().toString() === tmp.sort().toString())
        return r.id;
    }

    const room = this.roomRep.create(roomDeatils);
    await this.roomRep.save(room);
    return room.id;
  }

  async findRoom(roomId: number) {
    const room = await this.roomRep.findOne({
      where: { id: roomId },
      relations: ['messages', 'users'],
    });
    return room;
  }

  async createMsg(token: string, details: any) {
    const room = await this.roomRep.findOne({
      relations: ['messages'],
      where: { id: details.roomID },
    });
    const msg = this.messageRep.create({
      owner: details.owner,
      content: details.msg,
      createdAt: new Date(),
      room,
    });

    if (!room.messages) room.messages = [msg];
    else room.messages.push(msg);

    await this.roomRep.save(room);
    return this.messageRep.save(msg);
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
