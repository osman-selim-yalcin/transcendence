import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { userMiddelware } from '../../middleware/user.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/typeorm/User';
import { Room } from 'src/typeorm/Room';
import { Message } from 'src/typeorm/Message';
import { Notification } from 'src/typeorm/Notification';
import { RoomService } from './room.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Room, Message, Notification]),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RoomService, NotificationService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userMiddelware).forRoutes('api/user');
    // consumer.apply(userMiddelware).forRoutes({
    //   path: 'api/user',
    //   method: RequestMethod.GET,
    // });
  }
}
