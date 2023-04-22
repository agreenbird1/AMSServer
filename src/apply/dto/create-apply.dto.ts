import { IsArray } from 'class-validator';

export class CreateApplyDto {
  userId: number;
  @IsArray()
  assetIds: number[];
}
