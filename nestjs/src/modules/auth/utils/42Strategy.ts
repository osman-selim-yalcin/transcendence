import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthService)
  public authService: AuthService;

  constructor() {
    super({
      clientID: process.env.FORTY_TWO_CLIENT_ID,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
      callbackURL: process.env.FORTY_TWO_CALLBACK,
      scope: ['public'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService?.validateUser({
      username: profile.username,
      avatar: profile._json.image.link,
      sessionID: Math.floor(
        Math.random() * (1000000000 - 100000000) + 100000000,
      ).toString(16),
    });
    return user || null;
  }
}
