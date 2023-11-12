import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/42Strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { SessionSeriliazer } from './utils/Seriliazer';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, FortyTwoStrategy, SessionSeriliazer],
  controllers: [AuthController],
})
export class AuthModule {}
