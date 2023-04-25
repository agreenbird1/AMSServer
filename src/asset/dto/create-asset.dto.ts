import { IsOptional } from 'class-validator';

export class CreateAssetDto {
  name: string;
  specification: string;
  quantity: number;
  amount: number;
  categoryId: number;
  location: string;
  userId: number;

  @IsOptional()
  picture: string;
}
