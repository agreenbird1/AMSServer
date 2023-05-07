import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(User) {
  @IsOptional()
  categoryId?: number;
}
