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

@UseGuards(AuthGuard('access-jwt'))
@ApiBearerAuth('access-jwt')
@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '게시글 목록 조회' })
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
  @Post()
  async createPost(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    return await this.postService.createPost(req.user.userUuid, createPostDto);
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @Get('/:postId')
  async getPostInfo(@Req() req: Request, @Param('postId') postId: number) {
    return await this.postService.getPostInfo(req.user.userUuid, postId);
  }

  @ApiOperation({ summary: '게시글 좋아요/좋아요 취소' })
  @Post('like')
  async likePost(@Req() req: Request, @Body() likePostDto: LikePostDto) {
    return await this.postService.likePost(req.user.userUuid, likePostDto);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete('/:postId')
  async deletePost(@Req() req: Request, @Param('postId') postId: number) {
    return await this.postService.deletePost(req.user.userUuid, postId);
  }
}
