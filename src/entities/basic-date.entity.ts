import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BasicDate {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
