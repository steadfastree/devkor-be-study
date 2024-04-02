import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
// import { Reply } from 'src/entities/reply.entity';
import { CommentRepository } from './comment.repository';
import { PostService } from 'src/post/post.service';
import { PostModule } from 'src/post/post.module';
import { PostRepository } from 'src/post/repositories/post.repository';
import { Post } from 'src/entities/post.entity';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PostRepository],
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
