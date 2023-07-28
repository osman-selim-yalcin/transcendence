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

interface reqWithModifiy extends Request {
  user: {
    username: string;
    avatar: string;
    id: number;
  };
  logout: (any) => void;
}

@Controller('api/auth')
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
  @Redirect('http://localhost:5173/login')
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
      token: this.authService.createToken(
        request.user.username,
        request.user.avatar,
        request.user.id,
      ),
      user: {
        username: request.user.username,
        avatar: request.user.avatar,
      },
    };
  }

  @Post('tmp/create')
  tmpCreate(@Body() body: any) {
    console.log(body);
    this.authService.tmpCreate(body);
    return { msg: 'success' };
  }

  @Post('tmp/login')
  tmpLogin(@Body() body: any) {
    console.log(body);
    return this.authService.tmpLogin(body);
  }

  @Get('tmp/getUser')
  tmpGetUser(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.authService.tmpGetUser(token);
  }
}
