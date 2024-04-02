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
import { PostModule } from 'src/post/post.module';
import { PostRepository } from 'src/post/repositories/post.repository';
import { ViewRepository } from 'src/post/repositories/view.repository';
import { LikeRepository } from 'src/post/repositories/like.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    PostRepository,
    ViewRepository,
    LikeRepository,
  ],
  imports: [TypeOrmModule.forFeature([User, Post, View, Like])],
  exports: [UserService, UserRepository],
})
export class UserModule {}
