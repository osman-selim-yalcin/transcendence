import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  @Inject(ConfigService)
  public config: ConfigService;

  @Inject(AuthService)
  public authService: AuthService;

  constructor() {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL,
      scope: ['public'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService?.validateUser({
      username: profile.username,
      password: '12',
    });
    console.log(user);
    return user || null;
  }
}
