import { ConfigService } from '@nestjs/config';
import { HttpException, Inject, Injectable } from '@nestjs/common';
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
    return { msg: 'success' };
  }

  async removeFriend(token: string, friendname: string) {
    const loginUserInfo = this.verifyToken(token);
    const friendUser = await this.userRep.findOneBy({ username: friendname });
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

  async startRoom(token: string, friendname: string) {
    const loginUserInfo = this.verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });
    const friendUser = await this.userRep.findOneBy({ username: friendname });

    if (loginUser.id === friendUser.id) return;

    const roomDeatils = {
      users: [friendUser, loginUser],
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
    };

    const tmp = [friendUser.id, loginUser.id];

    const rooms = await this.roomRep.find({
      relations: ['users'],
      where: { users: roomDeatils.users },
    });

    for (const r of rooms) {
      const ids = r.users.map((u) => u.id);
      if (ids.length === 2 && ids.sort().toString() === tmp.sort().toString()) {
        return this.roomHelper(r, loginUser);
      }
    }

    const room = this.roomRep.create(roomDeatils);
    await this.roomRep.save(room);
    return this.roomHelper(room, loginUser);
  }

  async findRoom(roomId: number) {
    const room = await this.roomRep.findOne({
      where: { id: roomId },
      relations: ['messages', 'users'],
    });
    return room;
  }

  async deleteRoom(roomID: number) {
    const room = await this.roomRep.findOne({
      where: { id: roomID },
      relations: ['messages', 'users'],
    });
    await this.roomRep.remove(room);
    return { msg: 'success' };
  }

  async getUsersRooms(token: string) {
    const loginUserInfo = this.verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['rooms', 'rooms.users', 'rooms.messages'],
    });
    const rooms = loginUser.rooms.map((room) => {
      return this.roomHelper(room, loginUser);
    });
    return rooms;
  }

  roomHelper(room: Room, loginUser: User) {
    const tmp = room.users.filter((u) => u.username !== loginUser.username);
    const user = {
      id: tmp[0].id,
      username: tmp[0].username,
      avatar: tmp[0].avatar,
      status: tmp[0].status,
      lastSeen: tmp[0].lastSeen,
      sessionID: tmp[0].sessionID,
    };
    return {
      id: room.id,
      user,
      messages: room.messages,
      createdAt: room.createdAt,
    };
  }

  async createMsg(token: string, details: any) {
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
