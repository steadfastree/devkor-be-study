import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Reply } from 'src/entities/reply.entity';
import { CommentRepository } from './comment.repository';
import { ReplyService } from 'src/reply/reply.service';
import { ReplyModule } from 'src/reply/reply.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  imports: [TypeOrmModule.forFeature([Comment]), ReplyModule],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
