import { Injectable } from '@nestjs/common';
import { ReplyRepository } from './reply.repository';
import { CreateReplyDto } from './dtos/create-reply.dto';
import { ReplyInfoDto } from './dtos/reply-info.dto';

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

  async getRepliesByCommentId(commentId: number) {
    const replies = await this.replyRepository.find({
      where: { commentId: commentId },
      relations: ['user'],
    });
    const repliesList: ReplyInfoDto[] = replies.map(
      (reply) => new ReplyInfoDto(reply),
    );
    return repliesList;
  }
}
