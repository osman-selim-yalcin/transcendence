import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/typeorm/User';

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

  async findUserByUsername(username: string) {
    const user = await this.userRep.findOneBy({ username: username });
    return user;
  }

  async findUserBySessionID(sessionID: string) {
    const user = await this.userRep.findOneBy({ sessionID: sessionID });
    return user;
  }

  async handleStatusChange(user: any, status: string) {
    const updatedUser = await this.userRep.update(user.id, { status: status });
    return updatedUser;
  }

  async tmpCreate(userDetails: any) {
    const newUser = await this.userRep.create(userDetails);
    console.log(newUser);
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
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    const token = this.createToken({
      username: user.username,
      avatar: 'https://source.unsplash.com/featured/300x202',
      id: user.id,
      sessionID: user.sessionID,
    });
    return {
      token,
      user: {
        username: user.username,
        avatar: 'https://source.unsplash.com/featured/300x202',
        id: user.id,
        sessionID: user.sessionID,
      },
    };
  }

  createToken(tokenDetails: any) {
    const token = jwt.sign(tokenDetails, this.config.get('accessTokenSecret'), {
      expiresIn: '1h',
    });
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
