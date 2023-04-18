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
}
