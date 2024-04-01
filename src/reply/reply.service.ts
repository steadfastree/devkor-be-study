import { Injectable } from '@nestjs/common';
import { ReplyRepository } from './reply.repository';
import { CreateReplyDto } from './dtos/create-reply.dto';

@Injectable()
export class ReplyService {
  constructor(private readonly replyRepository: ReplyRepository) {}

  async createReply(userUuid: string, createReplyDto: CreateReplyDto) {
    const { postId, commentId, content } = createReplyDto;

    return await this.replyRepository.save({
      userUuid: userUuid,
      postId: postId,
      commentId: commentId,
      content: content,
    });
  }
}
