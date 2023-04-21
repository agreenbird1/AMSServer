import { Asset } from './entities/asset.entity';
import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { CategoryService } from 'src/category/category.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchAssetDto } from './dto/search-asset.dto';

@Injectable()
export class AssetService {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectRepository(Asset) private readonly asset: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const asset = new Asset();
    asset.name = createAssetDto.name;
    asset.amount = createAssetDto.amount;
    asset.location = createAssetDto.location;
    asset.picture =
      createAssetDto.picture ||
      'https://ydassetpicture.oss-cn-beijing.aliyuncs.com/pc-employee/app/dist/1681985422290/img/no-pic.2c7f0ca6.png';
    asset.quantity = createAssetDto.quantity;
    asset.specification = createAssetDto.specification;
    asset.category = await this.categoryService.findOne(
      createAssetDto.categoryId,
    );
    return this.asset.manager.save(asset);
  }

  async findAll(searchAssetDto: SearchAssetDto) {
    let qb = this.asset.createQueryBuilder('asset');

    if (searchAssetDto.categoryId)
      qb = qb.andWhere('asset.categoryId = :categoryId', searchAssetDto);
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
    return `This action returns a #${id} asset`;
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return `This action updates a #${id} asset`;
  }

  remove(id: number) {
    return `This action removes a #${id} asset`;
  }
}
