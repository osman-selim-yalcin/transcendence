import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { User } from './typeorm/User';
import { Room } from './typeorm/Room';
import { Message } from './typeorm/Message';
import { Notification } from './typeorm/Notification';
import { userMiddelware } from './middleware/user.middleware';
import { RoomModule } from './modules/room/room.module';
import { UsersController } from './modules/users/user.controller';
import { RoomController } from './modules/room/room.controller';
import { NotificationController } from './modules/notification/notification.controller';

@Module({
  imports: [
    UserModule,
    AuthModule,
    RoomModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'osyalcin',
      entities: [User, Room, Message, Notification],
      synchronize: true,
    }),
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(userMiddelware)
      .forRoutes(UsersController, RoomController, NotificationController);
  }
}
