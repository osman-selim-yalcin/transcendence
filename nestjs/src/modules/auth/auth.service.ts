import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/User';
import { createToken } from 'src/functions/token';

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

  async findUserByUsername(username: string) {
    const user = await this.userRep.findOneBy({ username: username });
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
}
