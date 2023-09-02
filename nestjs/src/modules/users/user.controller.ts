import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { UsersService } from 'src/modules/users/user.service';

@Controller('api/user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('allUsers')
  allUsers() {
    return this.usersService.findUsers();
  }

  @Get('allFriends')
  allFriends(@Req() req: any) {
    const token = req.token;
    return this.usersService.allFriends(token);
  }

  @Get('getUsersRooms')
  getUsersRooms(@Req() req: any) {
    const token = req.token;
    return this.usersService.getUsersRooms(token);
  }

  @Post('addfriend')
  addfriend(@Req() req: any, @Body() body: any) {
    const token = req.token;
    return this.usersService.addfriend(token, body.username);
  }

  @Post('removeFriend')
  removeFriend(@Req() req: any, @Body() body: any) {
    const token = req.token;
    return this.usersService.removeFriend(token, body.username);
  }

  @Post('startRoom')
  startRoom(@Req() req: any, @Body() body: any) {
    const token = req.token;
    return this.usersService.startRoom(token, body.username);
  }

  @Post('findRoom')
  findRoom(@Req() req: any, @Body() body: any) {
    return this.usersService.findRoom(body.roomId);
  }

  @Delete('deleteRoom/:roomID')
  deleteRoom(@Req() req: any, @Body() body: any) {
    return this.usersService.deleteRoom(req.params.roomID);
  }

  @Get('getGroups')
  getGroups(@Req() req: any) {
    const token = req.token;
    return this.usersService.getGroups(token);
  }

  @Post('createGroup')
  createGroup(@Req() req: any, @Body() body: any) {
    const token = req.token;
    return this.usersService.createGroup(token, body);
  }

  @Post('createNotification')
  createNotification(@Req() req: any, @Body() body: any) {
    const token = req.token;
    return this.usersService.createNotification(token, body);
  }

  @Get('getNotifications')
  getNotifications(@Req() req: any) {
    const token = req.token;
    return this.usersService.getNotifications(token);
  }

  @Delete('deleteNotification/:notificationID')
  deleteNotification(@Req() req: any) {
    return this.usersService.deleteNotification(req.params.notificationID);
  }

  @Post('createMsg')
  createMsg(@Req() req: any, @Body() body: any) {
    const token = req.token;
    return this.usersService.createMsg(token, body);
  }
}
