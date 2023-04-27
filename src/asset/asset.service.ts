import { Monitor } from './../monitor/entities/monitor.entity';
import { Asset } from './entities/asset.entity';
import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { CategoryService } from 'src/category/category.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchAssetDto } from './dto/search-asset.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AssetService {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectRepository(Asset) private readonly asset: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const asset = new Asset();
    asset.name = createAssetDto.name;
    asset.specification = createAssetDto.specification;
    asset.quantity = createAssetDto.quantity;
    asset.amount = createAssetDto.amount;
    asset.location = createAssetDto.location;
    asset.picture =
      createAssetDto.picture ||
      'https://ydassetpicture.oss-cn-beijing.aliyuncs.com/pc-employee/app/dist/1681985422290/img/no-pic.2c7f0ca6.png';
    asset.surplusQuantity = createAssetDto.quantity;
    asset.category = await this.categoryService.findOne(
      createAssetDto.categoryId,
    );
    asset.depreciationValue = asset.currentValue =
      asset.amount * asset.quantity;
    const handleUser = await this.asset.manager.getRepository(User).findOneBy({
      id: createAssetDto.userId,
    });
    asset.addUser = handleUser;
    const newAsset = await this.asset.manager.save(asset);
    // 新增资产需要同步到监控表
    this.asset.manager.getRepository(Monitor).save({
      type: 1,
      asset: newAsset,
      applyUser: handleUser,
      handleUser: handleUser,
    });
    return newAsset;
  }

  async findAll(searchAssetDto: SearchAssetDto) {
    let qb = this.asset.createQueryBuilder('asset');

    if (searchAssetDto.categoryId)
      qb = qb.andWhere('asset.categoryId = :categoryId', searchAssetDto);
    // 剩余可用需要大于0且状态为启用
    if (searchAssetDto.isApply)
      qb = qb.andWhere('asset.status = 1 and asset.surplusQuantity > 0');
    qb = qb.andWhere(`asset.name like :name`, {
      name: '%' + searchAssetDto.name + '%',
    });

    qb = qb
      .skip(searchAssetDto.pageSize * (searchAssetDto.pageNum - 1))
      .take(searchAssetDto.pageSize);
    const data = await qb.getManyAndCount();
    return {
      total: data[1],
      list: data[0],
    };
  }

  findOne(id: number) {
    return this.asset.findOneBy({ id });
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return this.asset.update(id, updateAssetDto);
  }

  remove(id: number) {
    return this.asset.delete(id);
  }
}
