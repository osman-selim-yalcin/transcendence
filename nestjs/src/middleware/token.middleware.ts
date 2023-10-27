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
    const user = await this.tokenToUser(token);
    req.user = user;
    next();
  }

  async tokenToUser(token: string) {
    const loginUserInfo = verifyToken(token);
    const user = await this.userRep.findOne({
      where: { id: loginUserInfo.id },
      relations: [
        'friends',
        'rooms',
        'rooms.users',
        'rooms.messages',
        'notifications',
        'notifications.creator',
        'notifications.sibling',
        'notifications.user',
        'won',
        'lost',
      ],
    });
    if (!user) throw new HttpException('user not found', 400);
    return user;
  }
}
