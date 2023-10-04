import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from 'src/typeorm/Notification';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
