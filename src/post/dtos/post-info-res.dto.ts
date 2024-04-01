import { ApiProperty } from '@nestjs/swagger';

export class PostInfoReplyDto {
  @ApiProperty({ description: 'The ID of the reply' })
  replyId: number;

  @ApiProperty({ description: 'The content of the reply' })
  content: string;

  @ApiProperty({ description: 'The UUID of the user who created the reply' })
  replierUuid: number;

  @ApiProperty({
    description: 'The nickname of the user who created the reply',
  })
  replierNickname: string;

  @ApiProperty({ description: 'The creation date of the reply' })
  replyCreatedAt: string;
}

export class PostInfoCommentDto {
  @ApiProperty({ description: 'The ID of the comment' })
  commentId: number;

  @ApiProperty({ description: 'The content of the comment' })
  content: string;

  @ApiProperty({ description: 'The UUID of the user who created the comment' })
  commenterUuid: number;

  @ApiProperty({
    description: 'The nickname of the user who created the comment',
  })
  commenterNickname: string;

  @ApiProperty({ description: 'The creation date of the comment' })
  commentCreatedAt: string;

  @ApiProperty({
    description: 'Replies on the comment',
    type: [PostInfoReplyDto],
    nullable: true,
  })
  replies: PostInfoReplyDto[];
}
export class PostInfoResDto {
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

  @ApiProperty({
    description: 'Comments on the post',
    type: [PostInfoCommentDto],
    nullable: true,
  })
  comments: PostInfoCommentDto[];
}
