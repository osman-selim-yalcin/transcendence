import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  @Inject(ConfigService)
  public config: ConfigService;

  async validateUser(userDetails: any) {
    const user = await this.userRep.findOneBy({
      username: userDetails.username,
    });
    if (user) return user;
    const newUser = this.userRep.create(userDetails);
    return this.userRep.save(newUser);
  }

  async findUser(username: string) {
    const user = await this.userRep.findOneBy({ username: username });
    return user;
  }

  async tmpCreate(userDetails: any) {
    const newUser = await this.userRep.create(userDetails);
    return this.userRep.save(newUser);
  }

  async tmpGetUser(token: any) {
    const user = this.verifyToken(token);
    return { user: user };
  }

  async tmpLogin(userDetails: any) {
    const user = await this.userRep.findOne({
      where: {
        username: userDetails.username,
      },
    });
    if (!user) return;
    const token = this.createToken(
      user.username,
      'https://source.unsplash.com/featured/300x202',
      user.id,
    );
    return {
      token,
      user: {
        username: user.username,
        avatar: 'https://source.unsplash.com/featured/300x202',
        id: user.id,
      },
    };
  }

  createToken(username: string, avatar: string, id: number) {
    const token = jwt.sign(
      { username: username, avatar: avatar, id: id },
      this.config.get('accessTokenSecret'),
      { expiresIn: '1h' },
    );
    return token;
  }

  verifyToken(token: string) {
    return jwt.verify(
      token,
      this.config.get('accessTokenSecret'),
      (err, decoded) => {
        if (err) {
          return false;
        }
        return decoded;
      },
    );
  }
}
