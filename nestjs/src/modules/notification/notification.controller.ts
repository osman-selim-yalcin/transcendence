import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post()
  createNotification(@Req() req: any, @Body() body: any) {
    return this.notificationService.createNotification(req.token, body);
  }

  @Get()
  getNotifications(@Req() req: any) {
    return this.notificationService.getNotifications(req.token);
  }

  @Delete()
  deleteNotification(@Req() req: any, @Body() body: any) {
    return this.notificationService.deleteNotification(
      req.params.notificationID,
    );
  }
}
