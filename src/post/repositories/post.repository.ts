import { Injectable } from '@nestjs/common';
import { Post } from 'src/entities/post.entity';
import { Repository, DataSource, Like } from 'typeorm';

@Injectable()
export class PostRepository extends Repository<Post> {
  private postRepository: Repository<Post>;

  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async getPostsListByKeyword(keyword: string, page: number = 1) {
    const take = 10;
    const skip = (page - 1) * take;
    const posts = await this.find({
      where: keyword
        ? [{ title: Like(`%${keyword}%`) }, { content: Like(`%${keyword}%`) }]
        : {},
      take: take ? take : 10,
      skip: skip ? skip : 0,
      relations: ['user'],
    });
    console.log(posts);

    return posts;
  }

  async getPostsListByUserUuid(userUuid: string, page: number = 1) {
    const take = 10;
    const skip = (page - 1) * take;
    const posts = await this.find({
      where: { userUuid: userUuid },
      take: take ? take : 10,
      skip: skip ? skip : 0,
      relations: ['user'],
    });

    return posts;
  }
}
