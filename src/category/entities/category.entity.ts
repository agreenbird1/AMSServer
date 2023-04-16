import {
  Entity,
  Tree,
  Column,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeChildren()
  children: Category[];

  @Column({
    type: 'enum',
    enum: [1, 2],
    default: 1,
  })
  type: 1 | 2; // 1: 资产分类 2：部门分类

  @TreeParent()
  parent: Category;
}
