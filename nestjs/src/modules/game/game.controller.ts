import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { gameDto } from 'src/types/game.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  allGames(@Req() req: any, @Param() param: gameDto) {
    return this.gameService.allGames(param);
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
