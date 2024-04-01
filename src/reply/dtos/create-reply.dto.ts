import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReplyDto {
  @ApiProperty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsNumber()
  commentId: number;

  @ApiProperty()
  @IsString()
  content: string;
}
