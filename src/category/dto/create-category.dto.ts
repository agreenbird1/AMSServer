import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  type: 1 | 2;

  @IsOptional()
  @IsNumber()
  parentId?: number | null;
}
