import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { LikePostDto } from './dtos/like-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetPostsListQuery } from 'src/common/decorators/get-posts-list.decorator';
import { AccessJwtGuard } from 'src/common/decorators/access-jwt-guard.decorator';
import { OkResponse } from 'src/common/decorators/ok-response.decorator';
import { CreatedResponse } from 'src/common/decorators/created-response.decorator';

@AccessJwtGuard()
@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '게시글 목록 조회' })
  @OkResponse('게시글 목록 조회 성공')
  @GetPostsListQuery()
  @Get()
  async getPostsList(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('keyword') keyword: string = '',
    @Query('orderType') orderType: string = 'createdAt',
    @Query('order') order: string = 'DESC',
  ) {
    return await this.postService.getPostsList(
      parseInt(page),
      keyword,
      orderType,
      order,
    );
  }

  @ApiOperation({ summary: '게시글 생성' })
  @CreatedResponse('게시글 생성 성공')
  @Post()
  async createPost(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    return await this.postService.createPost(req.user.userUuid, createPostDto);
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @OkResponse('게시글 상세 조회 성공')
  @Get('/:postId')
  async getPostInfo(@Req() req: Request, @Param('postId') postId: number) {
    return await this.postService.getPostInfo(req.user.userUuid, postId);
  }

  @ApiOperation({ summary: '게시글 좋아요/좋아요 취소' })
  @OkResponse('게시글 좋아요/좋아요 취소 성공')
  @Post('like')
  async likePost(@Req() req: Request, @Body() likePostDto: LikePostDto) {
    return await this.postService.likePost(req.user.userUuid, likePostDto);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @OkResponse('게시글 삭제 성공')
  @Delete('/:postId')
  async deletePost(@Req() req: Request, @Param('postId') postId: number) {
    return await this.postService.deletePost(req.user.userUuid, postId);
  }

  @ApiOperation({ summary: '테스트용 모킹 포스트 생성' })
  @CreatedResponse('테스트용 모킹 포스트 생성 성공')
  @Post('/mock')
  async createMockPosts(@Req() req: Request) {
    return await this.postService.createMockPosts(req.user.userUuid);
  }
}
