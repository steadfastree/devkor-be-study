import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentInfoDto } from './dtos/comment-info.dto';
import { Comment } from 'src/entities/comment.entity';
import { CreateReplyDto } from './dtos/create-reply.dto';
import { IsNull } from 'typeorm';
import { PostService } from 'src/post/post.service';
import { PostRepository } from 'src/post/repositories/post.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async createComment(userUuid: string, createCommentDto: CreateCommentDto) {
    const { content, postId } = createCommentDto;

    await this.updateCommentCount(postId, true);
    return await this.commentRepository.save({
      postId: postId,
      content: content,
      userUuid: userUuid,
    });
  }

  async createReply(userUuid: string, createReplyDto: CreateReplyDto) {
    const { content, parentCommentId, postId } = createReplyDto;

    await this.updateCommentCount(postId, true);
    return await this.commentRepository.save({
      postId: postId,
      content: content,
      userUuid: userUuid,
      parentCommentId: parentCommentId,
    });
  }

  async getCommentsByPostId(postId: number) {
    const comments = await this.commentRepository.find({
      where: { postId: postId, parentCommentId: IsNull() },
      relations: ['user', 'childrenComments'],
      withDeleted: true,
    });
    console.log(comments);

    //comments의 Childrencomment를 확인해서 존재하면 재귀적으로 실행?
    const commentsList: CommentInfoDto[] = await Promise.all(
      comments.map(async (comment) => this.getCommentInfo(comment)),
    );

    return commentsList;
  }
  //구조화는 맨 아래 leaf에서부터 올라가면서 실행되는데, Dto의 두 번째 파라미터가 비어 있으면 그대로 반환, 들어있으면 넣어서..
  //그럼 getCommentInfo는 DTO형태를 반환하도록 해야 하고

  //0-depth에서는 withdelete로 find, 1-depth부터는 표기 안하기? -> querybuilder로 통제하면 더 조작이 가능할까?
  //children을 먼저 체크하고 withdelete를 적용할지 말지

  //근데 재귀적으로 구현되기 때문에, 최하단부터 체크하며 올라가야 하지 않나?
  //그럼 Dto의 constructor에서 체크해서 올려주는 것이 제일 합리적일 듯?

  async getCommentInfo(comment: Comment) {
    if (!comment.childrenComments) {
      //여기 단계에서 DeletedAt을 추가로 체크하여서 null을 return
      //param으로 들어온 comment가 children이 존재하면 재귀적으로 실행, 아니면 해당 comment를 반환
      //근데 depth =1까지만 find에서 반환이 되니까 getCommentInfo 내부에서 다시 join하여 체크해주어야 한다.
      if (comment.deletedAt) {
        return null;
      }
      return new CommentInfoDto(comment, []);
    }
    return new CommentInfoDto(
      comment,
      await Promise.all(
        comment.childrenComments.map(async (childComment) => {
          const joinedChildComment = await this.commentRepository.findOne({
            where: { id: childComment.id },
            relations: ['user', 'childrenComments'],
            withDeleted: true,
          });
          return await this.getCommentInfo(joinedChildComment);
        }),
      ),
    );
  }

  async deleteComment(userUuid: string, commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (comment.userUuid !== userUuid) {
      throw new ForbiddenException('권한이 없습니다');
    }

    await this.commentRepository.softDelete({ id: commentId });
    await this.updateCommentCount(comment.postId, false);

    return 'deleteComment';
  }

  async updateCommentCount(postId: number, isPlus: boolean) {
    //이를 comment 단에서 사용하고자 postModule을 임포트시키면 순환 참조 오류..
    //그냥 postRepository를 Comment Service 단에서 가져와서 작업. 근데 맘에 안듦
    const post = await this.postRepository.findOne({ where: { id: postId } });
    await this.postRepository.update(postId, {
      commentCount: post.commentCount + (isPlus ? 1 : -1),
    });
  }
}
