import { Controller, Get, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  allGames() {
    return this.gameService.allGames();
  }

  @Get('history')
  history(@Req() req: any) {
    this.gameService.history(req.user);
  }

  @Post('invite')
  invite(@Req() req: any) {
    this.gameService.invite(req.user, req.friendUser);
  }
}
