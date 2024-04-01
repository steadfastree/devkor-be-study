import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(userUuid: string, createCommentDto: CreateCommentDto) {
    const { content, postId } = createCommentDto;

    return await this.commentRepository.save({
      postId: postId,
      content: content,
      userUuid: userUuid,
    });
  }
}
