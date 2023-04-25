import { Asset } from 'src/asset/entities/asset.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: [1, 0],
    default: 0,
  })
  status: 0 | 1; // 维修中 维修完成

  @CreateDateColumn()
  applyTime: Date;

  @Column({ nullable: true })
  completeTime: string;

  @Column()
  picture: string;

  @Column()
  description: string; // 申请描述

  @ManyToOne(() => User)
  applyUser: User;

  @ManyToOne(() => User)
  maintenanceUser: User;

  @ManyToOne(() => Asset)
  asset: Asset;
}
