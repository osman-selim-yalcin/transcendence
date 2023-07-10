import { Controller, Get, UseGuards } from '@nestjs/common';
import { FortyTwoStrategyGuard } from './utils/42StrategyGuard';

@Controller('api/auth')
export class AuthController {
  @Get('42/login')
  @UseGuards(FortyTwoStrategyGuard)
  handleLogin() {
    return '42 Login';
  }

  @Get('42/redirect')
  @UseGuards(FortyTwoStrategyGuard)
  handleRedirect() {
    console.log('redirect');
    return '42 Redirect';
  }
}
