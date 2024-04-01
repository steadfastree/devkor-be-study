import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LikePostDto {
  @ApiProperty()
  @IsString()
  postId: string;
}
