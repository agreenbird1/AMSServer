import { User } from 'src/user/entities/user.entity';
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

  @Column({ type: 'int' })
  surplusQuantity: number;

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

  @Column()
  @Generated('uuid')
  serialNumber: string;

  @Column({ type: 'double' })
  currentValue: number; // 当前资产总值

  @Column({ type: 'double', default: 0 })
  depreciationValue: number; // 计算折旧后剩余总值

  @Column({ type: 'int', default: 0 })
  useTimes: number;

  @Column({ type: 'int', default: 0 })
  maintenanceNumber: number;

  @Column({ type: 'double', default: 0 })
  maintenanceValue: number;

  @Column({ type: 'int', default: 0 })
  scrapNumber: number;

  @Column({ type: 'double', default: 0 })
  scrapValue: number;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => User)
  addUser: User; // 添加人
}
