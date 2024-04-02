import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { BasicDate } from './basic-date.entity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('view')
export class View extends BasicDate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.views)
  user: User;

  @RelationId((view: View) => view.user)
  @Column()
  userUuid: string;

  @ManyToOne((type) => Post, (post) => post.views)
  post: Post;

  @RelationId((view: View) => view.post)
  @Column()
  postId: number;
}
