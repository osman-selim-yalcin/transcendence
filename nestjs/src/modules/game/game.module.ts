import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/typeorm/Game';
import { User } from 'src/typeorm/User';
import { Notification } from 'src/typeorm/Notification';
import { idToUser } from 'src/middleware/user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User, Notification])],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(idToUser).forRoutes({
      path: 'game/invite',
      method: RequestMethod.POST,
    });
  }
}
