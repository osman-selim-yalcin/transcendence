import { Body, Controller, Get, Post, Req } from '@nestjs/common';
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
    const token = req.headers?.authorization?.split(' ')[1];
    return this.usersService.allFriends(token);
  }
  @Post('addfriend')
  addfriend(@Req() req: any, @Body() body: any) {
    const token = req.token;
    this.usersService.addfriend(token, body.username);
    return { msg: 'success' };
  }

  @Post('removeFriend')
  removeFriend(@Req() req: any, @Body() body: any) {
    const token = req.token;
    this.usersService.removeFriend(token, body.username);
    return { msg: 'success' };
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

  @Post('createMsg')
  createMsg(@Req() req: any, @Body() body: any) {
    const token = req.token;
    return this.usersService.createMsg(token, body);
  }
}
