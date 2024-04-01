import { ApiProperty } from '@nestjs/swagger';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Comment } from 'src/entities/comment.entity';
import { ReplyInfoDto } from 'src/reply/dtos/reply-info.dto';

export class CommentInfoDto {
  @ApiProperty({ description: 'The ID of the comment' })
  commentId: number;

  @ApiProperty({ description: 'The content of the comment' })
  content: string;

  @ApiProperty({ description: 'The UUID of the user who created the comment' })
  commenterUuid: string;

  @ApiProperty({
    description: 'The nickname of the user who created the comment',
  })
  commenterNickname: string;

  @ApiProperty({ description: 'The creation date of the comment' })
  commentCreatedAt: string;

  @ApiProperty({
    description: 'Replies on the comment',
    type: [ReplyInfoDto],
    nullable: true,
  })
  replies: ReplyInfoDto[];

  constructor(comment: Comment, replies: ReplyInfoDto[]) {
    this.commentId = comment.id;
    this.content = comment.content;
    this.commenterUuid = comment.userUuid;
    this.commenterNickname = comment.user.nickname;
    this.commentCreatedAt = format(
      utcToZonedTime(comment.createdAt, 'Asia/Seoul'),
      'yyyy-MM-dd HH:mm:ss XXX',
      { timeZone: 'Asia/Seoul' },
    );
    this.replies = replies;
  }
}
