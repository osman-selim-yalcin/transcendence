import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/42Strategy';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { SessionSeriliazer } from './utils/Seriliazer';
import { Session } from 'src/typeorm/Session';
import { socketGateway } from 'src/gateway/socket.gateway';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Session])],
  providers: [AuthService, FortyTwoStrategy, SessionSeriliazer, socketGateway],
  controllers: [AuthController],
})
export class AuthModule {}
