import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
