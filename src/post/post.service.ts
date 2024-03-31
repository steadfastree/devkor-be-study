import { Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { ViewRepository } from './repositories/view.repository';
import { LikeRepository } from './repositories/like.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly viewRepository: ViewRepository,
    private readonly likeRepository: LikeRepository,
  ) {}
}
