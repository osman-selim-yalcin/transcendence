import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkAuth } from 'src/functions/room';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';

@Injectable()
export class commandsMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private userRep: Repository<User>,
  ) {}

  async use(req: any, res: any, next: () => void) {
    checkAuth(req.room, req.user);
    if (!req.room.isGroup) throw new HttpException('not authorized', 400);
    req.friendUser = await this.idToUser(req.body.user.id, [
      'friends',
      'notifications',
      'notifications.creator',
    ]);
    if (req.friendUser.id === req.user.id)
      throw new HttpException('same user', 400);
    next();
  }

  async idToUser(id: number, relations?: string[]) {
    if (!id) throw new HttpException('user not found', 400);
    const user = await this.userRep.findOne({
      where: { id },
      relations: relations || [],
    });
    if (!user) throw new HttpException('user not found', 400);
    return user;
  }
}
