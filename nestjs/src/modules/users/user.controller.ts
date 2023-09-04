import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { UsersService } from 'src/modules/users/user.service';
import { RoomService } from './room.service';
import { NotificationService } from './notification.service';

@Controller('api/user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private roomService: RoomService,
    private notificationService: NotificationService,
  ) {}

  @Get('allUsers')
  allUsers() {
    return this.usersService.findUsers();
  }

  @Get('allFriends')
  allFriends(@Req() req: any) {
    return this.usersService.allFriends(req.token);
  }

  @Post('addfriend')
  addfriend(@Req() req: any, @Body() body: any) {
    return this.usersService.addfriend(req.token, body.username);
  }

  @Post('removeFriend')
  removeFriend(@Req() req: any, @Body() body: any) {
    return this.usersService.removeFriend(req.token, body.username);
  }

  //ROOMS
  @Get('getUsersRooms')
  getUsersRooms(@Req() req: any) {
    return this.roomService.getUsersRooms(req.token);
  }

  @Post('startRoom')
  startRoom(@Req() req: any, @Body() body: any) {
    return this.roomService.startRoom(req.token, body.username);
  }

  @Delete('deleteRoom/:roomID')
  deleteRoom(@Req() req: any) {
    return this.roomService.deleteRoom(req.params.roomID);
  }

  @Get('getGroups')
  getGroups(@Req() req: any) {
    return this.roomService.getGroups(req.token);
  }

  @Post('createGroup')
  createGroup(@Req() req: any, @Body() body: any) {
    return this.roomService.createGroup(req.token, body);
  }

  @Post('joinGroup')
  joinGroup(@Req() req: any, @Body() body: any) {
    return this.roomService.joinGroup(req.token, body);
  }

  //NOTIFICATIONS
  @Post('createNotification')
  createNotification(@Req() req: any, @Body() body: any) {
    return this.notificationService.createNotification(req.token, body);
  }

  @Get('getNotifications')
  getNotifications(@Req() req: any) {
    return this.notificationService.getNotifications(req.token);
  }

  @Delete('deleteNotification/:notificationID')
  deleteNotification(@Req() req: any) {
    return this.notificationService.deleteNotification(
      req.params.notificationID,
    );
  }

  @Post('createMsg')
  createMsg(@Body() body: any) {
    return this.usersService.createMsg(body);
  }
}
