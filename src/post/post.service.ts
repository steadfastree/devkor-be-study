import { Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { ViewRepository } from './repositories/view.repository';
import { LikeRepository } from './repositories/like.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { Like, OrderByCondition } from 'typeorm';
import { PostResDto, PostsListResDto } from './dtos/posts-list-res.dto';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly viewRepository: ViewRepository,
    private readonly likeRepository: LikeRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getPostsList(
    page: number,
    keyword: string,
    orderType: string,
    order: string,
  ) {
    const take = 10;
    const skip = (page - 1) * take;

    const posts = await this.postRepository.find({
      where: keyword
        ? [{ title: Like(`%${keyword}%`) }, { content: Like(`%${keyword}%`) }]
        : {},
      order: { [orderType]: order },
      take: take,
      skip: skip,
      relations: ['user'],
    });
    console.log(posts.length);
    console.log(posts[0].user.nickname);
    const postsList: PostsListResDto = {
      currentPage: page,
      currentItems: posts.length,
      posts: posts.map((post) => new PostResDto(post)),
    };

    console.log(posts);
    return postsList;
  }

  async createPost(userUuid: string, createPostDto: CreatePostDto) {
    const { title, content } = createPostDto;

    const user = await this.userRepository.findOne({
      where: { uuid: userUuid },
    });

    const post = await this.postRepository.save({
      title: title,
      content: content,
      userUuid: userUuid,
    });

    return 'createPost';
  }

  async getPostInfo(userUuid: string, postId: number) {
    const post = await this.postRepository.find({
      where: { id: postId },
      relations: ['user'],
    });
    const comments = await this.
    //post, user 릴레이션으로 추출 후, postId로 comment left join reply
  }

  async likePost() {
    return 'likePost';
  }

  async deletePost() {
    return 'deletePost';
  }
}
