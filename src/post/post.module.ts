import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Like } from 'src/entities/like.entity';
import { View } from 'src/entities/view.entity';
import { Reply } from 'src/entities/reply.entity';
import { PostRepository } from './repositories/post.repository';
import { ViewRepository } from './repositories/view.repository';
import { LikeRepository } from './repositories/like.repository';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, LikeRepository, ViewRepository],
  imports: [TypeOrmModule.forFeature([Post, Like, View])],
})
export class PostModule {}
