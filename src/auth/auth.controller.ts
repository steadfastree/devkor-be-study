import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { OkResponse } from 'src/common/decorators/ok-response.decorator';
import { CreatedResponse } from 'src/common/decorators/created-response.decorator';
import { AccessJwtGuard } from 'src/common/decorators/access-jwt-guard.decorator';
import { RefreshJwtGuard } from 'src/common/decorators/refresh-jwt-guard.decorator';
import { OAUTH_REDIRECT_URI } from 'src/common/constants/jwt.constant';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @OkResponse('회원가입 이메일 전송')
  @Post('/register')
  async register(@Req() req: Request, @Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({ summary: '회원가입 이메일 인증' })
  @CreatedResponse('회원가입 완료')
  @Get('/register/:token')
  async registerEmailAuth(@Req() req: Request, @Param('token') token: string) {
    return await this.authService.registerEmailAuth(token);
  }

  @ApiOperation({ summary: '로그인' })
  @OkResponse('로그인 성공')
  @Post('login')
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiOperation({ summary: '비밀번호 초기화' })
  @OkResponse('비밀번호 초기화 이메일 전송')
  @Post('password')
  async resetPassword(
    @Req() req: Request,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: '비밀번호 초기화 이메일 인증' })
  @OkResponse('비밀번호 초기화 완료')
  @Get('/password/:token')
  async resetPasswordEmailAuth(
    @Req() req: Request,
    @Param('token') token: string,
  ) {
    return await this.authService.resetPasswordEmailAuth(token);
  }

  @AccessJwtGuard()
  @OkResponse('로그아웃 성공')
  @ApiOperation({ summary: '로그아웃' })
  @Get('logout')
  async logout(@Req() req: Request) {
    return await this.authService.logout(req.user.userUuid);
  }

  @AccessJwtGuard()
  @OkResponse('회원 탈퇴 성공')
  @ApiOperation({ summary: '회원 탈퇴' })
  @Get('withdrawal')
  async withdrawal(@Req() req: Request) {
    return await this.authService.withdrawal(req.user.userUuid);
  }

  @AccessJwtGuard()
  @OkResponse('프로필 조회')
  @ApiOperation({ summary: '프로필 조회' })
  @Get('profile')
  getProfile(@Req() req: Request) {
    return { userUuid: req.user.userUuid, userNickname: req.user.userNickname };
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @RefreshJwtGuard()
  @OkResponse('토큰 갱신 성공')
  @Get('refresh')
  async refresh(@Req() req: Request) {
    return await this.authService.refresh(req.user);
  }

  @ApiOperation({ summary: '인스타그램 로그인' })
  @OkResponse('인스타그램 로그인')
  @Get('oauth/instagram')
  @Redirect(OAUTH_REDIRECT_URI)
  oauthInstagram() {
    return { url: OAUTH_REDIRECT_URI };
  }

  @ApiOperation({ summary: '인스타그램 로그인 리다이렉트' })
  @OkResponse('인스타그램 로그인 리다이렉트')
  @Get('oauth/instagram-redirect')
  async oauthInstagramRedirect(@Query('code') code: string) {
    return await this.authService.oauthInstagramRedirect(code);
  }
}
//https://localhost/auth/oauth/instagram/redirect
