import { Controller, Get, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  allGames(@Req() req: any) {
    return this.gameService.allGames(req.user);
  }

  @Post('invite')
  invite(@Req() req: any) {
    return this.gameService.invite(req.user, req.friendUser);
  }

  @Get('leaderboard')
  leaderboard() {
    return this.gameService.leaderboard();
  }
}
