import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { notificationDto } from 'src/types/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  getNotifications(@Req() req: any) {
    return this.notificationService.getNotifications(req.user);
  }

  @Post()
  createNotification(@Req() req: any, @Body() body: notificationDto) {
    return this.notificationService.createNotification(req.user, body);
  }

  @Delete()
  deleteNotification(@Req() req: any, @Body() body: notificationDto) {
    return this.notificationService.deleteNotification(body);
  }
}
