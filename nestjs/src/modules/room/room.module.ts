import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';
import { ConfigModule } from '@nestjs/config';
import { Message } from 'src/typeorm/Message';

@Module({
  imports: [TypeOrmModule.forFeature([Room, User, Message]), ConfigModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
