import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @ManyToOne(() => Category, (category) => category.users)
  @JoinColumn()
  category: Category;

  @Column()
  description: string;

  @Column()
  avatar: string;

  @Column({
    type: 'enum',
    enum: [1, 0],
    default: 1,
  })
  status: 0 | 1; // 0 停用 1 启用

  @Column({
    type: 'enum',
    enum: [1, 2, 3],
    default: 1,
  })
  role: 1 | 2 | 3; // 1 成员 2 管理员 3 超级管理员
}
