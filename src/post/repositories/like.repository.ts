import { Injectable } from '@nestjs/common';
import { Like } from 'src/entities/like.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class LikeRepository extends Repository<Like> {
  private likeRepository: Repository<Like>;

  constructor(private readonly dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }
}
