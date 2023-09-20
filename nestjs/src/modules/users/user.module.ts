import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { socketGateway } from 'src/gateway/socket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, socketGateway],
})
export class UserModule {}
