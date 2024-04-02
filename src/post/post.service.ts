import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { ViewRepository } from './repositories/view.repository';
import { LikeRepository } from './repositories/like.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { Like, OrderByCondition } from 'typeorm';
import { PostResDto, PostsListResDto } from './dtos/posts-list-res.dto';
import { UserRepository } from 'src/user/user.repository';
import { CommentService } from 'src/comment/comment.service';
import { PostInfoDto } from './dtos/post-info.dto';
import { CommentRepository } from 'src/comment/comment.repository';
import { LikePostDto } from './dtos/like-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly viewRepository: ViewRepository,
    private readonly likeRepository: LikeRepository,
    private readonly userRepository: UserRepository,
    private readonly commentService: CommentService,
    private readonly commentRepository: CommentRepository,
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
      //order: { [orderType]: order },
      take: take,
      skip: skip,
      relations: ['user', 'likes', 'views'],
    });

    posts.sort((a, b) => {
      let comparison = 0;
      switch (orderType) {
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'likeCount':
          comparison = a.likes.length - b.likes.length;
          break;
        case 'viewCount':
          comparison = a.views.length - b.views.length;
          break;
      }
      return order === 'ASC' ? comparison : -comparison;
    }); //개에바ㅋㅋ 나중에 쿼리 전부 createQueryBuilder로 뜯어고치면서 바꾸기

    const postsList: PostsListResDto = {
      currentPage: page,
      currentItems: posts.length,
      posts: await Promise.all(
        posts.map(
          async (post) =>
            new PostResDto(
              post,
              // 진짜로 맘에 너무 안드는 부분.. 그냥 작성,삭제 로직에 count 조작을 넣어버리는게 낫지 않을까
            ),
        ),
      ),
    };

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
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'likes', 'views'],
    });

    if (!post) throw new NotFoundException('게시글이 존재하지 않습니다.');

    const postInfo: PostInfoDto = new PostInfoDto(
      post,
      await this.commentService.getCommentsByPostId(postId),
    );

    await this.viewRepository.save({ userUuid: userUuid, postId: postId });
    await this.postRepository.update(postId, {
      viewCount: post.viewCount + 1,
    });

    return postInfo;
  }

  async likePost(userUuid: string, likePostDto: LikePostDto) {
    const like = await this.likeRepository.findOne({
      where: { userUuid: userUuid, postId: likePostDto.postId },
    });
    const post = await this.postRepository.findOne({
      where: { id: likePostDto.postId },
    });

    if (like) {
      await this.likeRepository.delete({ id: like.id });
      await this.postRepository.update(likePostDto.postId, {
        likeCount: post.likeCount - 1,
      });
    } else {
      await this.likeRepository.save({
        userUuid: userUuid,
        postId: likePostDto.postId,
      });
      await this.postRepository.update(likePostDto.postId, {
        likeCount: post.likeCount + 1,
      });
    }

    return 'likePost';
  }

  async deletePost(userUuid: string, postId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (post.userUuid !== userUuid) {
      throw new ForbiddenException('권한이 없습니다');
    }

    await this.postRepository.softDelete({ id: postId });

    return 'deletePost';
  }
}
