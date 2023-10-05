import { HttpException } from '@nestjs/common';
import { User } from 'src/typeorm/User';
import { notificationDto } from 'src/types/notification.dto';

export function isNotificationExist(
  user: User,
  notificationDetails: notificationDto,
  creator: User,
) {
  user.notifications?.map((n) => {
    if (n.type === notificationDetails.type && n.creator.id === creator.id) {
      throw new HttpException('already exist', 400);
    }
  });
  if (user.id === creator.id) throw new HttpException('same user', 400);
}
