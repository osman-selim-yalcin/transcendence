import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { UsersService } from 'src/modules/users/user.service';
import { userDto } from 'src/types/user.dto';

@Controller('api/user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //USERS
  @Get()
  allUsers(@Req() req: any) {
    return this.usersService.findUsers(req.token);
  }

  @Post()
  createUser(@Req() req: any, @Body() body: userDto) {
    return this.usersService.createUser(req.token, body);
  }

  @Delete()
  deleteUser(@Req() req: any, @Body() body: userDto) {
    return this.usersService.deleteUser(req.token, body);
  }

  @Put()
  updateUser(@Req() req: any, @Body() body: userDto) {
    return this.usersService.updateUser(req.token, body);
  }
}
