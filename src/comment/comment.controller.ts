import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateReplyDto } from './dtos/create-reply.dto';
@UseGuards(AuthGuard('access-jwt'))
@ApiBearerAuth('access-jwt')
@ApiTags('Comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 생성' })
  @Post()
  async createComment(
    @Req() req: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.createComment(
      req.user.userUuid,
      createCommentDto,
    );
  }

  @ApiOperation({ summary: '답글 생성' })
  @Post('/reply')
  async createReply(
    @Req() req: Request,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    return await this.commentService.createReply(
      req.user.userUuid,
      createReplyDto,
    );
  }

  @ApiOperation({ summary: '해당 게시물의 댓글 조회' })
  @Get()
  async getCommentsByPostId(@Query('postId') postId: number) {
    return await this.commentService.getCommentsByPostId(postId);
  }
  @ApiOperation({ summary: '댓글 삭제' })
  @Delete('/:commentId')
  async deleteComment(
    @Req() req: Request,
    @Param('commentId') commentId: number,
  ) {
    return await this.commentService.deleteComment(
      req.user.userUuid,
      commentId,
    );
  }
}
