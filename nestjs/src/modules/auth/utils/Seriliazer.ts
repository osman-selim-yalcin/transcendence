/* eslint-disable @typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSeriliazer extends PassportSerializer {
  @Inject(AuthService)
  public authService: AuthService;

  constructor() {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.authService.findUserByUsername(payload.username, [
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
    ]);
    return user ? done(null, user) : done(null, null);
  }
}
