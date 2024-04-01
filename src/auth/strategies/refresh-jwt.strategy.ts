import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.headers?.authorization?.split(' ')[1];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    const user = await this.userRepository.findOne({
      where: { uuid: payload.userUuid },
    });

    if (refreshToken !== user.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    return {
      userUuid: payload.userUuid,
      userNickname: payload.userNickname,
    };
  }
}
