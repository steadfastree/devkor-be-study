import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';
import { Reply } from './reply.entity';
import { Comment } from './comment.entity';
import { View } from './view.entity';
import { Like } from './like.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'nickname' })
  nickname: string;

  @OneToMany((type) => Post, (post) => post.user)
  posts: Post[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany((type) => Reply, (reply) => reply.user)
  replies: Reply[];

  @OneToMany((type) => View, (view) => view.user)
  views: View[];

  @OneToMany((type) => Like, (like) => like.user)
  likes: Like[];

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;
}
