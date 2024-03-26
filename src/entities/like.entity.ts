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

@Entity('like')
export class Like extends BasicDate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.likes)
  user: User;

  @RelationId((like: Like) => like.user)
  @Column({ name: 'user_uuid' })
  userUuid: string;

  @ManyToOne((type) => Post, (post) => post.likes)
  post: Post;

  @RelationId((like: Like) => like.post)
  @Column({ name: 'post_id' })
  postId: number;
}
