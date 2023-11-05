import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/User';
import { createToken } from 'src/functions/token';
import { twoFactorDto } from 'src/types/2fa.dto';
import * as speakeasy from 'speakeasy';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async validateUser(userDetails: any) {
    const user = await this.userRep.findOneBy({
      username: userDetails.username,
    });
    if (user) return user;
    const newUser = this.userRep.create(userDetails);
    return this.userRep.save(newUser);
  }

  async findUserByUsername(username: string, select?: any) {
    const user = await this.userRep.findOne({
      where: {
        username: username,
      },
      select,
    });
    return user;
  }

  async tmpCreate(userDetails: any) {
    const newUser = await this.userRep.create(userDetails);
    return this.userRep.save(newUser);
  }

  async tmpLogin(userDetails: any) {
    const user = await this.userRep.findOne({
      where: {
        username: userDetails.username,
      },
    });
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    const token = createToken({
      id: user.id,
    });
    return {
      token,
      user,
    };
  }

  async verify2fa(user: User, details: twoFactorDto) {
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: details.token,
    });
    if (verified && !user.twoFactorEnabled) {
      user.twoFactorEnabled = true;
      await this.userRep.save(user);
    }
    return verified;
  }
}
