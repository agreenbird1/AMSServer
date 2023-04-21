import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'double' })
  amount: number;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn()
  purchaseTime: Date;

  @Column()
  specification: string; // 规格型号

  @Column()
  picture: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: [0 | 1],
    default: 1,
  })
  status: 0 | 1;

  @Generated('uuid')
  serialNumber: string;

  @ManyToOne(() => Category)
  category: Category;
}
