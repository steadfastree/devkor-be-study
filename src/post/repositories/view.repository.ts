import { Injectable } from '@nestjs/common';
import { View } from 'src/entities/view.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ViewRepository extends Repository<View> {
  private viewRepository: Repository<View>;

  constructor(private readonly dataSource: DataSource) {
    super(View, dataSource.createEntityManager());
  }
}
