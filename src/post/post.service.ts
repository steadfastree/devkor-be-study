import { ForbiddenException, Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { ViewRepository } from './repositories/view.repository';
import { LikeRepository } from './repositories/like.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { Like, OrderByCondition } from 'typeorm';
import { PostResDto, PostsListResDto } from './dtos/posts-list-res.dto';
import { UserRepository } from 'src/user/user.repository';
import { CommentService } from 'src/comment/comment.service';
import { PostInfoDto } from './dtos/post-info.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly viewRepository: ViewRepository,
    private readonly likeRepository: LikeRepository,
    private readonly userRepository: UserRepository,
    private readonly commentService: CommentService,
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

    return posts;

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
    console.log(post);
    const postInfo: PostInfoDto = new PostInfoDto(
      post[0],
      await this.commentService.getCommentsByPostId(postId),
    );

    return postInfo;
  }

  async likePost() {
    return 'likePost';
  }

  async deletePost(userUuid: string, postId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (post.userUuid !== userUuid) {
      throw new ForbiddenException('권한이 없습니다');
    }

    return await this.postRepository.softDelete({ id: postId });
  }
}
