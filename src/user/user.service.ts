import { PostRepository } from 'src/post/repositories/post.repository';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/entities/user.entity';
import { PostResDto, PostsListResDto } from 'src/post/dtos/posts-list-res.dto';
import { LikeRepository } from 'src/post/repositories/like.repository';
import { ViewRepository } from 'src/post/repositories/view.repository';
import { Post } from 'src/entities/post.entity';
import { Like } from 'src/entities/like.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly viewRepository: ViewRepository,
    private readonly likeRepository: LikeRepository,
  ) {}

  async getOwnPostsList(userUuid: string, page: number) {
    const posts = await this.postRepository.getPostsListByUserUuid(
      userUuid,
      page,
    );
    const postsList: PostsListResDto = {
      currentPage: page,
      currentItems: posts.length,
      posts: await Promise.all(posts.map(async (post) => new PostResDto(post))),
    };
    return postsList;
  }

  async getViewedPostsList(userUuid: string, page: number) {
    //view에서 where uuid로 조회하여 postId 뽑기, 리스트화한 후 where in으로 검색
    const viewedPosts = await this.viewRepository.getViewdPostsByUserUuid(
      userUuid,
      page,
    );

    const posts: Post[] = await Promise.all(
      viewedPosts.map(async (view) => {
        return view.post;
      }),
    );
    const postsList: PostsListResDto = {
      currentPage: page,
      currentItems: posts.length,
      posts: await Promise.all(posts.map(async (post) => new PostResDto(post))),
    };

    return postsList;
  }

  async getLikedPostsList(userUuid: string, page: number) {
    const likedPosts = await this.likeRepository.getLikedPostsByUserUuid(
      userUuid,
      page,
    );

    const posts: Post[] = await Promise.all(
      likedPosts.map(async (like) => {
        return like.post;
      }),
    );
    const postsList: PostsListResDto = {
      currentPage: page,
      currentItems: posts.length,
      posts: await Promise.all(posts.map(async (post) => new PostResDto(post))),
    };

    return postsList;
  }
}
