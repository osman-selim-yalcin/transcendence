import { ConfigService } from '@nestjs/config';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';
import { Message } from 'src/typeorm/Message';
import { Notification } from 'src/typeorm/Notification';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Room) private roomRep: Repository<Room>,
    @InjectRepository(Message) private messageRep: Repository<Message>,
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
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

    await this.userRep.save(loginUser);
    await this.userRep.save(friendUser);
    return { msg: 's' };
  }

  async removeFriend(token: string, friendname: string) {
    const loginUserInfo = this.verifyToken(token);
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

  async startRoom(token: string, friendname: string) {
    const loginUserInfo = this.verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });
    const friendUser = await this.userRep.findOneBy({ username: friendname });

    if (loginUser.id === friendUser.id)
      throw new HttpException('same user', 400);

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
    if (!room.name) {
      const tmp = room.users.filter((u) => u.username !== loginUser.username);
      return {
        users: room.users,
        room: {
          roomID: room.id,
          name: tmp[0].username,
          avatar: tmp[0].avatar,
        },
        messages: room.messages,
        createdAt: room.createdAt,
      };
    }
    return {
      id: room.id,
      users: room.users,
      room: {
        roomID: room.id,
        name: room.name,
        avatar: room.avatar,
      },
      messages: room.messages,
      createdAt: room.createdAt,
    };
  }

  async createGroup(token: string, details: any) {
    const loginUserInfo = this.verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
    });
    if (!details.name) throw new HttpException('name is required', 400);
    const roomDeatils = {
      ...details,
      creator: loginUser.id,
      users: [loginUser, ...details.users],
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      isPrivate: false,
    };

    const room = this.roomRep.create(roomDeatils);
    await this.roomRep.save(room);
    return room;
  }

  async joinGroup(token: string, details: any) {}

  async getGroups(token: string) {}

  async updateGroup(token: string, details: any) {}

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

  async createNotification(token: string, details: any) {
    const loginUserInfo = this.verifyToken(token);
    const owner = loginUserInfo.username;
    const user = await this.userRep.findOne({
      where: { username: details.username },
      relations: ['notifications'],
    });

    user.notifications?.map((n) => {
      if (n.type === details.type && n.owner === owner) {
        throw new HttpException('already exist', 400);
      }
    });

    if (user.username === owner) throw new HttpException('same user', 400);

    const notification = this.notificationRep.create({
      content: details.content,
      owner,
      createdAt: new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      }),
      user,
      type: details.type,
    });
    if (!user.notifications) user.notifications = [notification];
    else user.notifications.push(notification);
    await this.userRep.save(user);
    return this.notificationRep.save(notification);
  }

  async getNotifications(token: string) {
    const loginUserInfo = this.verifyToken(token);
    const loginUser = await this.userRep.findOne({
      where: { username: loginUserInfo.username },
      relations: ['notifications'],
    });
    return loginUser.notifications;
  }

  async deleteNotification(id: number) {
    const notification = await this.notificationRep.findOne({ where: { id } });
    return this.notificationRep.delete({ id: notification.id });
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
