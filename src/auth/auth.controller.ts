import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('/register')
  async register(@Req() req: Request, @Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({ summary: '회원가입 이메일 인증' })
  @Get('/register/:token')
  async registerEmailAuth(@Req() req: Request, @Param('token') token: string) {
    return await this.authService.registerEmailAuth(token);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiOperation({ summary: '비밀번호 초기화' })
  @Post('password')
  async resetPassword(
    @Req() req: Request,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: '비밀번호 초기화 이메일 인증' })
  @Get('/password/:token')
  async resetPasswordEmailAuth(
    @Req() req: Request,
    @Param('token') token: string,
  ) {
    return await this.authService.resetPasswordEmailAuth(token);
  }

  @ApiBearerAuth('access-jwt')
  @UseGuards(AuthGuard('access-jwt'))
  @ApiOperation({ summary: '로그아웃' })
  @Get('logout')
  async logout(@Req() req: Request) {
    return await this.authService.logout(req.user.userUuid);
  }

  @ApiBearerAuth('access-jwt')
  @UseGuards(AuthGuard('access-jwt'))
  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiBearerAuth('access-jwt')
  @Get('withdrawal')
  async withdrawal(@Req() req: Request) {
    return await this.authService.withdrawal(req.user.userUuid);
  }

  @ApiBearerAuth('access-jwt')
  @UseGuards(AuthGuard('access-jwt'))
  @ApiOperation({ summary: '프로필 조회' })
  @Get('profile')
  getProfile(@Req() req: Request) {
    return { userUuid: req.user.userUuid, userNickname: req.user.userNickname };
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @ApiBearerAuth('refresh-jwt')
  @UseGuards(AuthGuard('refresh-jwt'))
  @Get('refresh')
  async refresh(@Req() req: Request) {
    return await this.authService.refresh(req.user);
  }
}
