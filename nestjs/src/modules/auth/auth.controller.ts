import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { FortyTwoStrategyGuard } from './utils/42StrategyGuard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { createToken } from 'src/functions/token';

interface reqWithModifiy extends Request {
  user: {
    username: string;
    avatar: string;
    id: number;
    sessionID: string;
  };
  logout: (err: any) => void;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42/login')
  @UseGuards(FortyTwoStrategyGuard)
  handleLogin() {
    return '42 Login';
  }

  @Get('42/redirect')
  @UseGuards(FortyTwoStrategyGuard)
  handleRedirect(@Response() res: any) {
    return res.redirect(process.env.CLIENT_URL);
  }

  @Get('logout')
  handleLogout(@Req() req: reqWithModifiy, @Response() res: any) {
    req.logout((err) => {
      console.log(err);
    });
    return res.redirect(process.env.CLIENT_URL);
  }

  @Get('user')
  async handleUser(@Req() request: reqWithModifiy, @Body() body: any) {
    if (!request.user) return null;
    const user = await this.authService.findUserByUsername(
      request.user.username,
      [
        'id',
        'username',
        'avatar',
        'sessionID',
        'displayName',
        'createdAt',
        'status',
        'lastSeen',
        'blockList',
        'elo',
        'twoFactorEnabled',
        'twoFactorSecret',
        'oldAvatar',
      ],
    );
    if (user.twoFactorEnabled) {
      if (!this.authService.verify2fa(user, body))
        throw new HttpException('2fa code is wrong', 400);
    }
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
      sessionID,
      username: body.username,
    };
    return this.authService.tmpCreate(details);
  }

  @Post('tmp/login')
  tmpLogin(@Body() body: any) {
    console.log(body);
    return this.authService.tmpLogin(body);
  }
}
