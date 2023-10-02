import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';

@Injectable()
export class idToUser implements NestMiddleware {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    if (req.body.id) {
      const friendUser = await this.idToUser(req.body.id, ['friends']);
      req.friendUser = friendUser;
    }
    next();
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
