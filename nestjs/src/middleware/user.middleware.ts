import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';

@Injectable()
export class idToUser implements NestMiddleware {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    let relations = [];
    let path: string = req.route.path.slice(4);
    if (path.endsWith('/')) path = path.slice(0, -1);
    const postMethod = req.route.methods.post;
    const deletMethod = req.route.methods.delete;
    if (path === 'game/invite') {
      relations = ['notifications', 'notifications.creator'];
    } else if (path === '/user' && postMethod) {
      relations = ['notifications', 'notifications.creator', 'friends'];
    } else if ((path === '/user' && deletMethod) || path === '/user/block') {
      relations = ['friends'];
    }

    const friendUser = await this.idToUser(req.body.id, relations);
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
