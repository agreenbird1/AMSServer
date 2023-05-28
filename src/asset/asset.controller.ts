import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { LockService } from 'src/common/services/lock.service';

@Controller('asset')
export class AssetController {
  constructor(
    private readonly lockService: LockService,
    private readonly assetService: AssetService,
  ) {}

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto) {
    await this.lockService.acquireLock();
    const res = await this.assetService.create(createAssetDto);
    this.lockService.releaseLock();
    return res;
  }

  @Post('update/:id')
  updateAsset(@Param('id') id: string, @Body() updateAssetDto) {
    return this.assetService.updateAsset(id, updateAssetDto);
  }

  @Post('list')
  findAll(@Body() searchAssetDto: any) {
    return this.assetService.findAll(searchAssetDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetService.remove(+id);
  }
}
