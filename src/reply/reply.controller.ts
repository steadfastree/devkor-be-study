import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
}
