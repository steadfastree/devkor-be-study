import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from 'src/entities/reply.entity';
import { ReplyRepository } from './reply.repository';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService, ReplyRepository],
  imports: [TypeOrmModule.forFeature([Reply])],
  exports: [ReplyService, ReplyRepository],
})
export class ReplyModule {}
