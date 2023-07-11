import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { FortyTwoStrategyGuard } from './utils/42StrategyGuard';

interface IGetUserAuthInfoRequest extends Request {
  user: string;
}

@Controller('api/auth')
export class AuthController {
  @Get('42/login')
  @UseGuards(FortyTwoStrategyGuard)
  handleLogin() {
    return '42 Login';
  }

  @Get('42/redirect')
  @UseGuards(FortyTwoStrategyGuard)
  @Redirect('http://localhost:5173/')
  handleRedirect() {
    console.log('42 Redirect');
    return { msg: '42 Redirect' };
  }

  @Get('user')
  handleUser(@Req() request: IGetUserAuthInfoRequest) {
    if (!request.user) return null;
    console.log('user in2');
    return { user: request.user };
  }
}
