import { Injectable } from '@nestjs/common';
import { Reply } from 'src/entities/reply.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class ReplyRepository extends Repository<Reply> {
  private replyRepository: Repository<Reply>;

  constructor(private readonly dataSource: DataSource) {
    super(Reply, dataSource.createEntityManager());
  }
}
