import { Injectable } from '@nestjs/common';
import { Post } from 'src/entities/post.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class PostRepository extends Repository<Post> {
  private postRepository: Repository<Post>;

  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }
}
