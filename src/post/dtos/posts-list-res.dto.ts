import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/entities/post.entity';

export class PostResDto {
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

  @ApiProperty({ description: 'The number of views of the post' })
  views: number;

  @ApiProperty({ description: 'The number of comments on the post' })
  comments: number;

  constructor(post: Post) {
    this.postId = post.id;
    this.title = post.title;
    this.content = post.content;
    this.userNickname = post.user.nickname;
    this.createdAt = new Date(post.createdAt).toISOString();
    this.likes = post.likeCount;
    this.views = post.viewCount;
    this.comments = post.comments.length;
  }
}

export class PostsListResDto {
  @ApiProperty({ description: 'The current page number' })
  currentPage: number;

  @ApiProperty({ description: 'The number of items on the current page' })
  currentItems: number;

  @ApiProperty({ description: 'The list of posts', type: [PostResDto] })
  posts: PostResDto[];
}
