import { ApiProperty } from '@nestjs/swagger';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Comment } from 'src/entities/comment.entity';

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
    description: 'children of the comment',
    type: [CommentInfoDto],
    nullable: true,
  })
  childrenComments: CommentInfoDto[];

  constructor(comment: Comment, childrenComments: CommentInfoDto[]) {
    if (comment.deletedAt) {
      this.commentId = comment.id;
      this.content = '삭제된 댓글입니다.';
      this.commenterUuid = null;
      this.commenterNickname = null;
      this.commentCreatedAt = null;
      this.childrenComments = childrenComments;
    } else {
      this.commentId = comment.id;
      this.content = comment.content;
      this.commenterUuid = comment.userUuid;
      this.commenterNickname = comment.user.nickname;
      this.commentCreatedAt = format(
        utcToZonedTime(comment.createdAt, 'Asia/Seoul'),
        'yyyy-MM-dd HH:mm:ss XXX',
        { timeZone: 'Asia/Seoul' },
      );
      this.childrenComments = childrenComments;
    }
  }
}
