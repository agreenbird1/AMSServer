import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  // 实体关联
  imports: [TypeOrmModule.forFeature([User]), CategoryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
