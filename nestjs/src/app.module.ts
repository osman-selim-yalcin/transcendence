import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'osyalcin',
      entities: [User],
      synchronize: true,
    }),
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
