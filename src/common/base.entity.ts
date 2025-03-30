import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  public updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  public deletedAt: Date;
}
