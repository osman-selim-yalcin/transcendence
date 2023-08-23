import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { userMiddelware } from '../../middleware/user.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { ConfigModule } from '@nestjs/config';
import { Room } from 'src/typeorm/Room';
import { Message } from 'src/typeorm/Message';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room, Message]), ConfigModule],
  controllers: [UsersController],
  providers: [UsersService],
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
