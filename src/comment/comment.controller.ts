import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateCommentDto } from './dtos/create-comment.dto';
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
}
