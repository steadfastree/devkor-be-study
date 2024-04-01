import { ApiProperty } from '@nestjs/swagger';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Reply } from 'src/entities/reply.entity';

export class ReplyInfoDto {
  @ApiProperty({ description: 'The ID of the reply' })
  replyId: number;

  @ApiProperty({ description: 'The content of the reply' })
  content: string;

  @ApiProperty({ description: 'The UUID of the user who created the reply' })
  replierUuid: string;

  @ApiProperty({
    description: 'The nickname of the user who created the reply',
  })
  replierNickname: string;

  @ApiProperty({ description: 'The creation date of the reply' })
  replyCreatedAt: string;

  constructor(reply: Reply) {
    this.replyId = reply.id;
    this.content = reply.content;
    this.replierUuid = reply.userUuid;
    this.replierNickname = reply.user.nickname;
    this.replyCreatedAt = format(
      utcToZonedTime(reply.createdAt, 'Asia/Seoul'),
      'yyyy-MM-dd HH:mm:ss XXX',
      { timeZone: 'Asia/Seoul' },
    );
  }
}
