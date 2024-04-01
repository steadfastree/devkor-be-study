import { ApiProperty } from '@nestjs/swagger';
import { format, utcToZonedTime } from 'date-fns-tz';
import { CommentInfoDto } from 'src/comment/dtos/comment-info.dto';
import { Post } from 'src/entities/post.entity';

export class PostInfoDto {
  @ApiProperty({ description: 'The ID of the post' })
  postId: number;

  @ApiProperty({ description: 'The title of the post' })
  title: string;

  @ApiProperty({ description: 'The content of the post' })
  content: string;

  @ApiProperty({ description: 'The nickname of the user who created the post' })
  userNickname: string;

  @ApiProperty({ description: 'The creation date of the post' })
  createdAt: string;

  @ApiProperty({ description: 'The number of likes of the post' })
  likes: number;

  @ApiProperty()
  likeNicknames: string[];

  @ApiProperty({ description: 'The number of views of the post' })
  views: number;

  @ApiProperty({ description: 'The number of comments on the post' })
  commentCount: number;

  @ApiProperty({
    description: 'Comments on the post',
    type: [CommentInfoDto],
    nullable: true,
  })
  comments: CommentInfoDto[];

  constructor(post: Post, comments: CommentInfoDto[]) {
    this.postId = post.id;
    this.title = post.title;
    this.content = post.content;
    this.userNickname = post.user.nickname;
    this.createdAt = format(
      utcToZonedTime(post.createdAt, 'Asia/Seoul'),
      'yyyy-MM-dd HH:mm:ss XXX',
      { timeZone: 'Asia/Seoul' },
    );
    this.likes = post.likes?.length || 0;
    this.views = post.views?.length || 0;
    let commentCount = 0;
    comments.forEach(
      (comment) =>
        (commentCount +=
          comment.content == '삭제된 댓글입니다.'
            ? comment.replyCount
            : comment.replyCount + 1),
    );
    this.commentCount = commentCount;
    this.comments = comments;
  }
}
