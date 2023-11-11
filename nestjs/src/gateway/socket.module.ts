import { Global, Module } from '@nestjs/common';
import { socketGateway } from './socket.gateway';
import { Game } from 'src/typeorm/Game';
import { User } from 'src/typeorm/User';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  providers: [socketGateway],
  imports: [TypeOrmModule.forFeature([Game, User])],
  exports: [socketGateway],
})
export class SocketClientModule {}
