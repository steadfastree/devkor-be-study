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
import { ReplyService } from './reply.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateReplyDto } from './dtos/create-reply.dto';

@UseGuards(AuthGuard('access-jwt'))
@ApiBearerAuth('access-jwt')
@ApiTags('Replies')
@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @ApiOperation({ summary: '답글 생성' })
  @Post()
  async createReply(
    @Req() req: Request,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    return await this.replyService.createReply(
      req.user.userUuid,
      createReplyDto,
    );
  }

  @ApiOperation({ summary: '댓글의 답글 조회' })
  @Get()
  async getRepliesByCommentId(@Query('commentId') commentId: number) {
    return await this.replyService.getRepliesByCommentId(commentId);
  }

  @ApiOperation({ summary: '답글 삭제' })
  @Delete('/:replyId')
  async deleteReply(@Req() req: Request, @Param('replyId') replyId: number) {
    return await this.replyService.deleteReply(req.user.userUuid, replyId);
  }
}
