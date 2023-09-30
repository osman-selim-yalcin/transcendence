import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { UsersService } from 'src/modules/users/user.service';
import { userDto } from 'src/types/user.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  allUsers(@Req() req: any) {
    return this.usersService.allUsers(req.query, req.body);
  }

  @Post()
  addFriend(@Req() req: any, @Body() body: userDto) {
    return this.usersService.addFriend(req.token, body);
  }

  @Delete()
  deleteFriend(@Req() req: any, @Body() body: userDto) {
    return this.usersService.deleteFriend(req.token, body);
  }

  @Put()
  updateUser(@Req() req: any, @Body() body: userDto) {
    return this.usersService.updateUser(req.token, body);
  }

  @Get('info')
  getUserInfo(@Req() req: any) {
    return this.usersService.getUserInfo(req.token);
  }

  @Get('friends')
  getFriends(@Req() req: any) {
    return this.usersService.getFriends(req.token);
  }
}
