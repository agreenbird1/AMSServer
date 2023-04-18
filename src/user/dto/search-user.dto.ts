import { IsOptional } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  userName: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  categoryId: number;

  pageNum: number;
  pageSize: number;
}
