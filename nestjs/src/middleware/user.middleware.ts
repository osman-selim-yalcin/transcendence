import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';

@Injectable()
export class idToUser implements NestMiddleware {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const friendUser = await this.idToUser(req.body.id, [
      'friends',
      'blocked',
      'notifications',
      'notifications.user',
      'notifications.creator',
    ]);
    if (req.user.id === friendUser.id)
      throw new HttpException('same user', 400);
    req.friendUser = friendUser;
    next();
  }

  async idToUser(id: number, relations?: string[]) {
    if (!id) throw new HttpException('id required', 404);
    if (typeof id !== 'number')
      throw new HttpException('id must be a number', 404);
    const user = await this.userRep.findOne({
      where: { id: id },
      relations: relations || [],
    });
    if (!user) throw new HttpException('user not found', 404);
    return user;
  }
}
