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

  @Post('tmp/create')
  tmpCreate(@Body() body: any) {
    console.log(body);
    this.usersService.tmpCreate(body);
    return { msg: 'success' };
  }

  @Post('addfriend')
  addfriend(@Req() req: any, @Body() body: any) {
    //tmp
    const token = req.headers?.authorization?.split(' ')[1];
    //tmp

    this.usersService.addfriend(token, body.username);
    return { msg: 'success' };
  }

	@Post('removeFriend')
  removeFriend(@Req() req: any, @Body() body: any) {
    //tmp
    const token = req.headers?.authorization?.split(' ')[1];
    //tmp

    this.usersService.removeFriend(token, body.username);
    return { msg: 'success' };
  }
}
