import { LockService } from 'src/common/services/lock.service';
import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { Asset } from './entities/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), CategoryModule],
  controllers: [AssetController],
  providers: [AssetService, LockService],
  exports: [AssetService],
})
export class AssetModule {}
