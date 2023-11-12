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
import { RoomModule } from './modules/room/room.module';
import { UsersController } from './modules/users/user.controller';
import { RoomController } from './modules/room/room.controller';
import { NotificationController } from './modules/notification/notification.controller';
import { NotificationModule } from './modules/notification/notification.module';
import { tokenMiddleware } from './middleware/token.middleware';
import { SocketClientModule } from './gateway/socket.module';
import { Game } from './typeorm/Game';
import { GameModule } from './modules/game/game.module';
import { GameController } from './modules/game/game.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    RoomModule,
    SocketClientModule,
    NotificationModule,
    GameModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.SQL_URL || 'localhost',
      port: parseInt(process.env.SQL_PORT),
      username: process.env.SQL_USERNAME,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE,
      entities: [User, Room, Message, Notification, Game],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(tokenMiddleware)
      .forRoutes(
        UsersController,
        RoomController,
        NotificationController,
        GameController,
      );
  }
}
