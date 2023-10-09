import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/typeorm/Room';
import { User } from 'src/typeorm/User';
import { ConfigModule } from '@nestjs/config';
import { Message } from 'src/typeorm/Message';
import { CommandsService } from './commands.service';
import { RoomMiddleware } from 'src/middleware/room.middleware';
import { commandsMiddleware } from 'src/middleware/commands.middleware';
import { Notification } from 'src/typeorm/Notification';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, User, Message, Notification]),
    ConfigModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, CommandsService],
  exports: [RoomService, CommandsService],
})
export class RoomModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RoomMiddleware)
      .exclude(
        { path: 'room', method: RequestMethod.GET },
        { path: 'room/user-rooms', method: RequestMethod.GET },
        { path: 'room', method: RequestMethod.POST },
      )
      .forRoutes(RoomController);

    consumer.apply(commandsMiddleware).forRoutes({
      path: 'room/command/*',
      method: RequestMethod.POST,
    });
  }
}
