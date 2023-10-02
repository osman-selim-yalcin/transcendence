import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verifyToken } from 'src/functions/token';
import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';

@Injectable()
export class RoomMiddleware implements NestMiddleware {
  constructor(@InjectRepository(Room) private roomRep: Repository<Room>) {}

  async use(req: any, res: any, next: () => void) {
    const room = await this.idToRoom(req.body.roomId);
    req.room = room;
    next();
  }

  async idToRoom(id: number) {
    const room = await this.roomRep.findOne({
      where: { id },
      relations: ['users', 'messages'],
    });
    if (!room) throw new HttpException('room not found', 400);
    return room;
  }
}
