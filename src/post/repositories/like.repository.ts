import { Injectable } from '@nestjs/common';
import { Like } from 'src/entities/like.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class LikeRepository extends Repository<Like> {
  private likeRepository: Repository<Like>;

  constructor(private readonly dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }

  async getLikedPostsByUserUuid(userUuid: string, page: number = 1) {
    const take = 10;
    const skip = (page - 1) * take;
    const likedPostsList = await this.createQueryBuilder('like')
      .leftJoinAndSelect('like.post', 'post')
      .leftJoinAndSelect('post.user', 'user') //조인 순서 아쉽
      .where('like.userUuid = :userUuid', { userUuid })
      .orderBy('post.createdAt', 'ASC')
      .take(take ? take : 10)
      .skip(skip ? skip : 0)
      .getMany();

    return likedPostsList;
  }
}
