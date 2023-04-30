import { Maintenance } from './../../maintenance/entities/maintenance.entity';
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
export class Monitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: [1, 2, 3, 4, 5],
  })
  type: 1 | 2 | 3 | 4 | 5; // 新增 领用 维修 退还 报废

  @ManyToOne(() => User)
  applyUser: User;

  @Column({ nullable: true })
  useTime: number;

  @ManyToOne(() => User)
  handleUser: User;

  @ManyToOne(() => Asset)
  asset: Asset;

  @ManyToOne(() => Maintenance)
  maintenance: Maintenance;

  @CreateDateColumn()
  createTime: Date;
}
