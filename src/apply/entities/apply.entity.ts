import { Asset } from 'src/asset/entities/asset.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Apply {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  approveUser: User;

  @Column({
    type: 'enum',
    enum: [1, 2, 3, 4, 5],
    default: 1,
  })
  status: 1 | 2 | 3 | 4 | 5; // 审批中、已批准、已驳回、待签收、已签收

  @CreateDateColumn()
  applyTime: Date;

  @Column({ type: 'date' })
  approveTime: Date;

  @Column()
  rejectReason: string;

  @Column()
  remark: string;

  @OneToOne(() => User)
  user: User;

  @OneToOne(() => Asset)
  asset: Asset;
}
