import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/typeorm/Game';
import { User } from 'src/typeorm/User';
import { typeGame } from 'src/types/game.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRep: Repository<Game>,
    @InjectRepository(User) private userRep: Repository<User>,
  ) {}

  createGame(gameDetails: typeGame) {
    const newGame = this.gameRep.create(gameDetails);
    newGame.winner.elo += newGame.elo;
    newGame.loser.elo -= newGame.elo;
    this.gameRep.save(newGame);
    this.userRep.save(newGame.winner);
    this.userRep.save(newGame.loser);
  }
}
