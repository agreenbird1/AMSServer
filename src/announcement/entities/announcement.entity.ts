import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  userName: string;

  @Column()
  content: string;

  @Column({
    nullable: true,
  })
  picture: string;
}
