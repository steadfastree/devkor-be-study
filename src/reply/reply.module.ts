import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from 'src/entities/reply.entity';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService],
  imports: [TypeOrmModule.forFeature([Reply])],
})
export class ReplyModule {}
