import { Global, Module } from '@nestjs/common';
import { SocketClient } from './socket-client';
import { socketGateway } from './socket.gateway';
import { UsersService } from 'src/modules/users/user.service';
import { UserModule } from 'src/modules/users/user.module';
import { RoomService } from 'src/modules/room/room.service';
import { RoomModule } from 'src/modules/room/room.module';

@Global()
@Module({
  providers: [socketGateway],
  imports: [UserModule],
  exports: [socketGateway],
})
export class SocketClientModule {}
