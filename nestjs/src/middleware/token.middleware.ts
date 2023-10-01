import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { verifyToken } from 'src/functions/token';

@Injectable()
export class tokenMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) throw new HttpException('Token not found', 401);
    if (!verifyToken(token)) throw new HttpException('Token not valid', 401);
    req.token = token;
    next();
  }
}
