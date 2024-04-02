import { Controller, Get, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessJwtGuard } from 'src/common/decorators/access-jwt-guard.decorator';
import { OkResponse } from 'src/common/decorators/ok-response.decorator';
import { Request } from 'express';

@AccessJwtGuard()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저가 작성한 게시글 조회' })
  @OkResponse('유저가 작성한 게시글')
  @ApiQuery({ name: 'page', required: false })
  @Get('/posts')
  async getOwnPostsList(
    @Req() req: Request,
    @Query('page') page: string = '1',
  ) {
    return await this.userService.getOwnPostsList(
      req.user.userUuid,
      parseInt(page),
    );
  }

  @ApiOperation({ summary: '유저가 조회한 게시글 조회' })
  @OkResponse('유저가 조회한 게시글')
  @ApiQuery({ name: 'page', required: false })
  @Get('/viewed-posts')
  async getViewedPostsList(
    @Req() req: Request,
    @Query('page') page: string = '1',
  ) {
    return await this.userService.getViewedPostsList(
      req.user.userUuid,
      parseInt(page),
    );
  }

  @ApiOperation({ summary: '유저가 좋아요한 게시글 조회' })
  @OkResponse('유저가 좋아요한 게시글')
  @ApiQuery({ name: 'page', required: false })
  @Get('/liked-posts')
  async getLikePostsList(
    @Req() req: Request,
    @Query('page') page: string = '1',
  ) {
    return await this.userService.getLikedPostsList(
      req.user.userUuid,
      parseInt(page),
    );
  }
}
