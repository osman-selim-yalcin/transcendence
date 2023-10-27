import { Global, Module } from '@nestjs/common';
import { socketGateway } from './socket.gateway';
import { UserModule } from 'src/modules/users/user.module';
import { GameModule } from 'src/modules/game/game.module';

@Global()
@Module({
  providers: [socketGateway],
  imports: [UserModule, GameModule],
  exports: [socketGateway],
})
export class SocketClientModule {}
