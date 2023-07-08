import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

  async registerUser(user: CreateUserDto) {
    const newPassword = await bcrypt.hash(user.password, 12);
    const newUser = this.userRep.create({
      username: user.username,
      password: newPassword,
    });
    await this.userRep.save(newUser);
    const token = jwt.sign(
      { username: user.username },
      this.config.get('accessTokenSecret'),
      { expiresIn: '1h' },
    );
    return token;
  }

  async loginUser(user: CreateUserDto) {
    const userFound = await this.userRep.findOneBy({ username: user.username });
    if (!userFound) {
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
    }
    const passwordMatch = await bcrypt.compare(
      user.password,
      userFound.password,
    );
    if (!passwordMatch) {
      throw new HttpException('Password wrong', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { username: user.username },
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
        return true;
      },
    );
  }

  deleteUser(id: number) {
    return this.userRep.delete(id);
  }
}
