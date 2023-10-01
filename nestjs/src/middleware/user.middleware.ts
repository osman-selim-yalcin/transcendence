import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verifyToken } from 'src/functions/token';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';

@Injectable()
export class tokenToUser implements NestMiddleware {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const user = await this.tokenToUser(req.token);
    if (req.body.id) {
      const friendUser = await this.idToUser(req.body.id, ['friends']);
      req.friendUser = friendUser;
    }
    req.user = user;
    next();
  }

  async tokenToUser(token: string) {
    const loginUserInfo = verifyToken(token);
    const user = await this.userRep.findOne({
      where: { id: loginUserInfo.id },
      relations: ['friends', 'notifications', 'rooms', 'notifications.creator'],
    });
    if (!user) throw new HttpException('user not found', 400);
    return user;
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
