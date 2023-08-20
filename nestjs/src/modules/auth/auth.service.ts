import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/typeorm/User';
import { Session } from 'src/typeorm/Session';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Session) private sessionRep: Repository<Session>,
  ) {}

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

  async findSession(sessionID: string) {
    const session = await this.sessionRep.findOneBy({ id: sessionID });
    return session;
  }

  async changeSessionStatus(sessionID: string, status: boolean) {
    const session = await this.sessionRep.findOneBy({ id: sessionID });
    session.connected = status;
    return this.sessionRep.save(session);
  }

  async saveSession(sessionID: string, session: any) {
    const newSession = this.sessionRep.create({
      id: sessionID,
      userID: session.userID,
      username: session.username,
      connected: session.connected,
    });
    return this.sessionRep.save(newSession);
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
