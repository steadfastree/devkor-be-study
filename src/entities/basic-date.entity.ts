import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BasicDate {
  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
