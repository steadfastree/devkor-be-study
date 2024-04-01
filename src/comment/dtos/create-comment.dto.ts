import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsString()
  content: string;
}
