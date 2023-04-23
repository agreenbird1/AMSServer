import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
