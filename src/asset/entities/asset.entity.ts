import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'timestamp' })
  purchaseTime: Date;

  @Column()
  specification: string; // 规格型号

  @Generated('uuid')
  serialNumber: string;

  @ManyToOne(() => Category)
  category: Category;
}
