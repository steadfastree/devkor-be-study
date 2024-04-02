import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8)
  @Matches(/^(?=.*[!@#$%])[a-zA-Z0-9!@#$%]+$/, {
    message:
      '비밀번호는 8글자 이상이며, 특수문자(!, @, #, $, %)를 포함하여야 합니다.',
  })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @Length(8)
  @Matches(/^(?=.*[!@#$%])[a-zA-Z0-9!@#$%]+$/, {
    message:
      '비밀번호는 8글자 이상이며, 특수문자(!, @, #, $, %)를 포함하여야 합니다.',
  })
  newPasswordConfirmed: string;
}
