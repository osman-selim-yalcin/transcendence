import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/User';
import { twoFactorDto } from 'src/types/2fa.dto';
import * as speakeasy from 'speakeasy';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async validateUser(userDetails: any) {
    const user = await this.userRep.findOne({
      where: {
        username: userDetails.username,
      },
      select: [
        'id',
        'username',
        'avatar',
        'sessionID',
        'displayName',
        'createdAt',
        'status',
        'lastSeen',
        'blockList',
        'elo',
        'twoFactorEnabled',
        'twoFactorSecret',
        'oldAvatar',
      ],
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

  async verify2fa(user: User, token: string) {
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
    });
    return verified;
  }
}
