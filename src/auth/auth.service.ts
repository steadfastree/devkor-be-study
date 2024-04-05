import { UserRepository } from '../user/user.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ACCESS_TOKEN_EXPIRE,
  EMAIL_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
} from 'src/common/constants/jwt.constant';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AccessTokenPayload } from './dtos/access-token.payload';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
  ) {}

  async register(registerDto: RegisterDto) {
    //이미 해당 이메일 존재하는지 확인
    const duplicatedEmail = await this.userRepository.findOne({
      where: { email: registerDto.email },
      withDeleted: true,
    });
    if (duplicatedEmail) {
      if (duplicatedEmail.deletedAt) {
        throw new ConflictException('탈퇴한 계정입니다.');
      } else {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
    }

    //중복 닉네임 확인
    const duplicatedNickname = await this.userRepository.findOne({
      where: { nickname: registerDto.nickname },
    });

    if (duplicatedNickname)
      throw new ConflictException('이미 존재하는 닉네임입니다.');

    //jwt화
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const userPayload = {
      userEmail: registerDto.email,
      userNickname: registerDto.nickname,
      userPassword: hashedPassword,
    };
    const userPayloadJwt = await this.jwtService.signAsync(userPayload, {
      expiresIn: EMAIL_TOKEN_EXPIRE,
    });

    //이메일 전송
    await this.mailerService.sendMail({
      to: registerDto.email,
      subject: '회원가입 이메일 인증',
      text:
        '다음 링크를 클릭하여 회원가입을 완료해주세요. \n' +
        process.env.BASE_URL +
        '/auth/register/' +
        userPayloadJwt,
    });

    return {
      message: '이메일로 인증 링크가 전송되었습니다. 확인해주세요.',
    };
  }

  async registerEmailAuth(token: string) {
    //jwt 해독
    const userPayload = await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });

    //다시 예외 처리
    const user = await this.userRepository.findOne({
      where: { email: userPayload.userEmail },
    });
    if (user) throw new ConflictException('이미 가입 처리된 이메일입니다.');

    //유저 생성

    await this.userRepository.save({
      email: userPayload.userEmail,
      nickname: userPayload.userNickname,
      password: userPayload.userPassword,
    });

    //이메일 인증 완료 시 DB에 저장
    return {
      To: `${userPayload.userNickname}님,`,
      message: '가입이 완료되었습니다. 로그인해주세요.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    //유저 검증
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) throw new NotFoundException('존재하지 않는 이메일입니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');

    //토큰 생성
    const payload: AccessTokenPayload = {
      userUuid: user.uuid,
      userNickname: user.nickname,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRE,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRE,
    });

    //리프레시 토큰 DB 저장
    await this.userRepository.update(user.uuid, {
      refreshToken: refreshToken,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword, newPasswordConfirmed } = resetPasswordDto;

    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new NotFoundException('존재하지 않는 이메일입니다.');

    if (newPassword !== newPasswordConfirmed)
      throw new BadRequestException('비밀번호를 다시 확인해 주세요.');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const payload = {
      email: email,
      newPassword: hashedNewPassword,
    };

    const userPayloadJwt = await this.jwtService.signAsync(payload, {
      expiresIn: EMAIL_TOKEN_EXPIRE,
    });

    //이메일 전송
    await this.mailerService.sendMail({
      to: email,
      subject: '비밀번호 초기화 이메일 인증',
      text:
        '다음 링크를 클릭하여 비밀번호 초기화를 완료해주세요. \n' +
        process.env.BASE_URL +
        '/auth/password/' +
        userPayloadJwt,
    });

    return {
      message: '이메일로 인증 링크가 전송되었습니다. 확인해주세요.',
    };
  }

  async resetPasswordEmailAuth(token: string) {
    console.log(token);

    //jwt 해독
    const userPayload = await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });

    console.log(userPayload);

    //다시 예외 처리
    const user = await this.userRepository.findOne({
      where: { email: userPayload.email },
    });

    await this.userRepository.update(user.uuid, {
      password: userPayload.newPassword,
    });

    //이메일 인증 완료 시 DB에 저장
    return {
      To: `${user.nickname}님,`,
      message: '비밀번호가 변경되었습니다. 다시 로그인해주세요.',
    };
  }

  async refresh(user: AccessTokenPayload) {
    const payload: AccessTokenPayload = {
      userUuid: user.userUuid,
      userNickname: user.userNickname,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRE,
    });
    return {
      accessToken: accessToken,
    };
  }

  async logout(userUuid: string) {
    await this.userRepository.update(userUuid, {
      refreshToken: null,
    });

    return {
      message: '로그아웃 되었습니다.',
    };
  }

  async withdrawal(userUuid: string) {
    await this.userRepository.update(userUuid, { refreshToken: null });
    await this.userRepository.softDelete({ uuid: userUuid });

    return {
      message: '회원 탈퇴 되었습니다.',
    };
  }

  async oauthInstagram(req: any) {
    return await this.httpService.axiosRef.get(
      `https://api.instagram.com/oauth/authorize?client_id=957565182609778&redirect_uri=${process.env.BASE_URL}/&scope=user_profile,user_media&response_type=code`,
    );
  }
}
