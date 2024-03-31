import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ACCESS_TOKEN_EXPIRE } from 'src/common/constants/jwt.constant';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserModule } from 'src/user/user.module';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: ACCESS_TOKEN_EXPIRE },
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'smtp.naver.com',
          port: 587,
          auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"DEVKOR-BE" <${process.env.EMAIL_ID}@naver.com>`,
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
})
export class AuthModule {}
