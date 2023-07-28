import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from 'src/modules/users/user.service';

@Injectable()
export class userMiddelware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  use(req: any, res: any, next: () => void) {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) throw new HttpException('Token not found', 401);
    if (!this.usersService.verifyToken(token))
      throw new HttpException('Token not valid', 401);
    req.token = token;
    next();
  }
}
