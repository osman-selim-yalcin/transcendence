import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/typeorm/Game';
import { User } from 'src/typeorm/User';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User])],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
