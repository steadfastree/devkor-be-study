import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class LikePostDto {
  @ApiProperty()
  @IsNumber()
  postId: number;
}
