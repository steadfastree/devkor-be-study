import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { BasicDate } from './basic-date.entity';

@Entity('reply')
export class Reply extends BasicDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne((type) => User, (user) => user.replies)
  user: User;

  @RelationId((reply: Reply) => reply.user)
  @Column({ name: 'user_uuid' })
  userUuid: string;

  @ManyToOne((type) => Post, (post) => post.replies)
  post: Post;

  @RelationId((reply: Reply) => reply.post)
  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne((type) => Comment, (comment) => comment.replies)
  comment: Comment;

  @RelationId((reply: Reply) => reply.comment)
  @Column({ name: 'comment_id' })
  commentId: number;
}
