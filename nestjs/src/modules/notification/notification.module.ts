import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from 'src/typeorm/Notification';
import { socketGateway } from 'src/gateway/socket.gateway';
import { UsersService } from '../users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, socketGateway, UsersService],
})
export class NotificationModule {}
