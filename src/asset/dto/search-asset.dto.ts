import { IsOptional, IsString } from 'class-validator';

export class SearchAssetDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  categoryId: number;

  pageNum: number;
  pageSize: number;
}
