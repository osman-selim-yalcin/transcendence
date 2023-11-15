import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { verifyToken } from 'src/functions/token';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';

@Injectable()
export class tokenMiddleware implements NestMiddleware {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) throw new HttpException('Token not found', 401);
    if (!verifyToken(token)) throw new HttpException('Token not valid', 401);
    req.token = token;

    //slice api
    let relations = [];
    let path: string = req.route.path.slice(4);
    if (path.endsWith('/')) path = path.slice(0, -1);
    const getMethod = req.route.methods.get;
    const postMethod = req.route.methods.post;
    const deletMethod = req.route.methods.delete;
    console.log(path);
    if (path == '/user/info') {
      // relations = [
      //   'friends',
      //   'rooms',
      //   'rooms.users',
      //   'rooms.messages',
      //   'notifications',
      //   'notifications.creator',
      //   'won',
      //   'won.winner',
      //   'won.loser',
      //   'lost',
      //   'lost.winner',
      //   'lost.loser',
      // ];
    } else if (path === '/game/invite') {
      relations = ['notifications', 'notifications.creator'];
    } else if (path === '/notification' && getMethod) {
      relations = ['notifications', 'notifications.creator'];
    } else if (path === '/room' && postMethod) {
      relations = ['rooms', 'friends'];
    } else if (path === '/room/user-rooms') {
      relations = ['rooms', 'rooms.users', 'rooms.messages'];
    } else if (path === '/room/join') {
      relations = [
        'notifications',
        'notifications.user',
        'notifications.creator',
      ];
    } else if (path === '/user' && postMethod) {
      relations = ['notifications', 'notifications.creator', 'friends'];
    } else if (
      path === '/user/friends' ||
      (path === '/user' && deletMethod) ||
      path === '/user/block'
    ) {
      relations = ['friends'];
    }
    // else if (path === '/user/') {
    //   relations = ['notifications'];
    // }

    const user = await this.tokenToUser(token, relations);
    req.user = user;
    next();
  }

  async tokenToUser(token: string, relations: string[]) {
    const loginUserInfo = verifyToken(token);
    const user = await this.userRep.findOne({
      where: { id: loginUserInfo.id },
      select: [
        'id',
        'username',
        'avatar',
        'sessionID',
        'displayName',
        'createdAt',
        'status',
        'lastSeen',
        'blockList',
        'elo',
        'twoFactorEnabled',
        'twoFactorSecret',
        'oldAvatar',
      ],
      relations,
    });
    if (!user) throw new HttpException('user not found', 400);
    return user;
  }
}
