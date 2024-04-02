import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { View } from './view.entity';
import { Like } from './like.entity';
import { BasicDate } from './basic-date.entity';

@Entity('user')
export class User extends BasicDate {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  uuid: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @OneToMany((type) => Post, (post) => post.user)
  posts: Post[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany((type) => View, (view) => view.user)
  views: View[];

  @OneToMany((type) => Like, (like) => like.user)
  likes: Like[];

  @Column({ nullable: true })
  refreshToken: string;
}
