import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentInfoDto } from './dtos/comment-info.dto';
import { ReplyService } from 'src/reply/reply.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly replyService: ReplyService,
  ) {}

  async createComment(userUuid: string, createCommentDto: CreateCommentDto) {
    const { content, postId } = createCommentDto;

    return await this.commentRepository.save({
      postId: postId,
      content: content,
      userUuid: userUuid,
    });
  }

  async getCommentsByPostId(postId: number) {
    const comments = await this.commentRepository.find({
      where: { postId: postId },
      relations: ['user'],
    });

    const commentsList: CommentInfoDto[] = await Promise.all(
      comments.map(
        async (comment) =>
          new CommentInfoDto(
            comment,
            await this.replyService.getRepliesByCommentId(comment.id),
          ),
      ),
    );

    return commentsList;
  }
}
