import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
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
    return this.roomService.startRoom(req.token, body);
  }

  @Delete('deleteRoom/:roomID')
  deleteRoom(@Req() req: any) {
    return this.roomService.deleteRoom(req.params.roomID);
  }

  @Post('exitRoom')
  exitRoom(@Req() req: any, @Body() body: any) {
    return this.roomService.exitRoom(req.token, body.roomID);
  }

  @Get('getGroups')
  getGroups() {
    return this.roomService.getGroups();
  }

  @Post('createGroup')
  createGroup(@Req() req: any, @Body() body: any) {
    return this.roomService.createGroup(req.token, body);
  }

  @Post('joinGroup')
  joinGroup(@Req() req: any, @Body() body: any) {
    return this.roomService.joinGroup(req.token, body);
  }

  @Put('updateGroup')
  updateGroup(@Req() req: any, @Body() body: any) {
    return this.roomService.updateGroup(req.token, body);
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
