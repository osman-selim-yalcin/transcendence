import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/42Strategy';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { SessionSeriliazer } from './utils/Seriliazer';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  providers: [AuthService, FortyTwoStrategy, SessionSeriliazer],
  controllers: [AuthController],
})
export class AuthModule {}
