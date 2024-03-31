import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { Like } from 'src/entities/like.entity';
import { View } from 'src/entities/view.entity';
import { UserRepository } from 'src/user/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService, UserRepository],
})
export class UserModule {}
