import {
  Controller,
  Get,
  HttpException,
  Query,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { FortyTwoStrategyGuard } from './utils/42StrategyGuard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { createToken } from 'src/functions/token';
import { User } from 'src/typeorm/User';

interface reqWithModifiy extends Request {
  user: User;
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
  handleRedirect(@Req() req: reqWithModifiy, @Response() res: any) {
    if (req.user.twoFactorEnabled)
      return res.redirect(process.env.CLIENT_URL + '/2fa');
    return res.redirect(process.env.CLIENT_URL);
  }

  @Get('logout')
  handleLogout(@Req() req: reqWithModifiy, @Response() res: any) {
    req.logout((err: any) => {
      console.log(err);
    });
    return res.redirect(process.env.CLIENT_URL);
  }

  @Get('token')
  async handleUser(@Req() request: reqWithModifiy, @Query() query: any) {
    if (!request.user) return null;
    console.log('query', query);
    if (request.user.twoFactorEnabled) {
      if (!query || !query.code)
        throw new HttpException('2fa code is missing', 400);
      console.log(
        'true or false',
        this.authService.verify2fa(request.user, query.code),
      );
      if (!this.authService.verify2fa(request.user, query.code))
        throw new HttpException('2fa code is wrong', 400);
    }
    return {
      token: createToken({
        username: request.user.username,
        id: request.user.id,
        sessionID: request.user.sessionID,
      }),
    };
  }

  // @Post('tmp/create')
  // tmpCreate(@Body() body: any) {
  //   const sessionID = Math.floor(
  //     Math.random() * (1000000000 - 100000000) + 100000000,
  //   ).toString(16);
  //   if (!sessionID) return;
  //   const details = {
  //     sessionID,
  //     username: body.username,
  //   };
  //   return this.authService.tmpCreate(details);
  // }

  // @Post('tmp/login')
  // tmpLogin(@Body() body: any) {
  //   console.log(body);
  //   return this.authService.tmpLogin(body);
  // }
}
