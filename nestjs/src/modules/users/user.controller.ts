import { Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/modules/users/user.service';

@Controller('api/user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('allUsers')
  allUsers() {
    return this.usersService.findUsers();
  }
}
