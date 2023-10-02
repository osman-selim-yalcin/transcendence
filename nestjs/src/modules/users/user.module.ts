import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { socketGateway } from 'src/gateway/socket.gateway';
import { Notification } from 'src/typeorm/Notification';
import { idToUser } from 'src/middleware/user.middleware';
import { NotificationMiddleware } from 'src/middleware/notification.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  controllers: [UsersController],
  providers: [UsersService, socketGateway],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(idToUser).forRoutes({
      path: 'user',
      method: RequestMethod.DELETE,
    });
    consumer
      .apply(idToUser, NotificationMiddleware)
      .forRoutes({ path: 'user', method: RequestMethod.POST });
  }
}
