import { Asset } from 'src/asset/entities/asset.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Apply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: [1, 2, 3, 4, 5],
    default: 1,
  })
  status: 1 | 2 | 3 | 4 | 5; // 审批中、已批准、已驳回、待签收、已签收

  @Column({
    type: 'enum',
    enum: [1, 2, 3, 4],
    nullable: true,
  })
  myStatus: 1 | 2 | 3 | 4; // 正常使用、维修中、退还中、已报废

  @CreateDateColumn()
  applyTime: Date;

  @Column({ nullable: true })
  approveTime: string;

  @Column({ nullable: true })
  signTime: string;

  @Column({ nullable: true })
  returnTime: string;

  @Column({ nullable: true })
  rejectReason: string;

  @Column({ nullable: true })
  remark: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Asset)
  asset: Asset;

  @ManyToOne(() => User)
  approveUser: User;
}
