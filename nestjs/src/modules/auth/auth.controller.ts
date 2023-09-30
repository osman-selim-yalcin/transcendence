import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FortyTwoStrategyGuard } from './utils/42StrategyGuard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { createToken } from 'src/functions/user';

interface reqWithModifiy extends Request {
  user: {
    username: string;
    avatar: string;
    id: number;
    sessionID: string;
  };
  logout: (any) => void;
}

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  public authService: AuthService;

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

  @Get('logout')
  @Redirect('http://localhost:5173/')
  handleLogout(@Req() req: reqWithModifiy) {
    req.logout((err) => {
      console.log(err);
    });
    return { msg: 'Logout' };
  }

  @Get('user')
  handleUser(@Req() request: reqWithModifiy) {
    if (!request.user) return null;
    return {
      token: createToken({
        username: request.user.username,
        id: request.user.id,
        sessionID: request.user.sessionID,
      }),
      user: request.user,
    };
  }

  @Post('tmp/create')
  tmpCreate(@Body() body: any) {
    const sessionID = Math.floor(
      Math.random() * (1000000000 - 100000000) + 100000000,
    ).toString(16);
    if (!sessionID) return;
    const details = {
      ...body,
      status: 'online',
      sessionID,
    };
    return this.authService.tmpCreate(details);
  }

  @Post('tmp/login')
  tmpLogin(@Body() body: any) {
    console.log(body);
    return this.authService.tmpLogin(body);
  }
}
