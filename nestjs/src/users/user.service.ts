import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  @Inject(ConfigService)
  public config: ConfigService;

  findUsers() {
    return this.userRep.find();
  }

  verifyToken(token: string) {
    return jwt.verify(
      token,
      this.config.get('accessTokenSecret'),
      (err, decoded) => {
        if (err) {
          return false;
        }
        return true;
      },
    );
  }
}
