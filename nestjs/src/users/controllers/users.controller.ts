import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users.service';

@Controller('api/user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() userData: CreateUserDto) {
    return this.usersService.registerUser(userData);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() userData: CreateUserDto) {
    return this.usersService.loginUser(userData);
  }

  @Post('allUsers')
  allUsers(@Req() request: Request) {
    const token = request.headers?.authorization?.split(' ')[1];
    if (!token) return { message: 'No token provided' };
    if (!this.usersService.verifyToken(token))
      return { message: 'Token invalid' };
    return this.usersService.findUsers();
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted' };
  }
}
