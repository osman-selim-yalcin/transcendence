import { Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async validateUser(userDetails: CreateUserDto) {
    const user = await this.userRep.findOneBy({
      username: userDetails.username,
    });
    if (user) return user;
    const newUser = this.userRep.create(userDetails);
    return this.userRep.save(newUser);
  }

  async findUser(username: string) {
    const user = await this.userRep.findOneBy({ username });
    return user;
  }
}
