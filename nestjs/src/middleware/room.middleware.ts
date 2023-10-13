import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/typeorm/Room';
import { Repository } from 'typeorm';

@Injectable()
export class RoomMiddleware implements NestMiddleware {
  constructor(@InjectRepository(Room) private roomRep: Repository<Room>) {}

  async use(req: any, res: any, next: () => void) {
    const room = await this.idToRoom(req.body.id);
    req.room = room;
    next();
  }

  async idToRoom(id: number) {
    if (!id) throw new HttpException('id required', 400);
    if (typeof id !== 'number')
      throw new HttpException('id must be a number', 400);
    const room = await this.roomRep.findOne({
      where: { id },
      relations: ['users', 'messages'],
    });
    if (!room) throw new HttpException('room not found', 400);
    return room;
  }
}
