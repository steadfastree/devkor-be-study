import { Injectable } from '@nestjs/common';
import { View } from 'src/entities/view.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ViewRepository extends Repository<View> {
  private viewRepository: Repository<View>;

  constructor(private readonly dataSource: DataSource) {
    super(View, dataSource.createEntityManager());
  }

  async getViewdPostsByUserUuid(userUuid: string, page: number = 1) {
    const take = 10;
    const skip = (page - 1) * take;

    const viewedPostsList = await this.createQueryBuilder('view')
      .leftJoinAndSelect('view.post', 'post')
      .leftJoinAndSelect('post.user', 'user') //조인 순서 아쉽
      .where('view.userUuid = :userUuid', { userUuid })
      .orderBy('post.createdAt', 'ASC')
      .groupBy('post.id')
      .take(take ? take : 10)
      .skip(skip ? skip : 0)
      .getMany();
    return viewedPostsList;
  }
}
