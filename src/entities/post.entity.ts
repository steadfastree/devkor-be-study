import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
// import { Reply } from './reply.entity';
import { BasicDate } from './basic-date.entity';
import { Like } from './like.entity';
import { View } from './view.entity';

@Entity('post')
export class Post extends BasicDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne((type) => User, (user) => user.posts)
  user: User;

  @RelationId((post: Post) => post.user)
  @Column() //fk
  userUuid: string;

  @Column({ default: 0 })
  commentCount: number;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany((type) => Like, (like) => like.post)
  likes: Like[];

  @OneToMany((type) => View, (view) => view.post)
  views: View[];

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  viewCount: number;
}
