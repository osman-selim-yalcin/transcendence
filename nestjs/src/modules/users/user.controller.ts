import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { UsersService } from 'src/modules/users/user.service';
import { userDto } from 'src/types/user.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  allUsers(@Req() req: any) {
    return this.usersService.allUsers(req.query);
  }

  @Get('friends')
  getFriends(@Req() req: any) {
    return this.usersService.getFriends(req.user);
  }

  @Post()
  addFriend(@Req() req: any) {
    return this.usersService.addFriend(req.user, req.friendUser);
  }

  @Delete()
  deleteFriend(@Req() req: any) {
    return this.usersService.deleteFriend(req.user, req.friendUser);
  }

  @Put()
  updateUser(@Req() req: any, @Body() body: userDto) {
    return this.usersService.updateUser(req.user, body);
  }

  @Get('info')
  getUserInfo(@Req() req: any) {
    return this.usersService.getUserInfo(req.user);
  }
}
