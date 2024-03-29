import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { gameDto } from 'src/types/game.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  allGames(@Req() req: any, @Query() query: gameDto) {
    return this.gameService.allGames(req.user, query);
  }

  @Post('invite')
  invite(@Req() req: any) {
    return this.gameService.invite(req.user, req.friendUser);
  }

  @Get('opponent')
  async opponent(@Req() req: any) {
    const rs = await this.gameService.getOpponent(req.user);
    return rs;
  }

  @Get('leaderboard')
  leaderboard(@Req() req: any) {
    return this.gameService.leaderboard(req.user);
  }
}
