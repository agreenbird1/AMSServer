import { IsOptional, IsString } from 'class-validator';

export class SearchAssetDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  categoryId: number;

  @IsOptional()
  isApply: boolean;

  pageNum: number;
  pageSize: number;
}
