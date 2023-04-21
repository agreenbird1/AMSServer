import { Injectable } from '@nestjs/common';
import { CreateApplyDto } from './dto/create-apply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from 'src/asset/entities/asset.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Apply } from './entities/apply.entity';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(Apply) private readonly apply: Repository<Apply>,
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Asset) private readonly asset: Repository<Asset>,
  ) {}

  async create(createApplyDto: CreateApplyDto) {
    const apply = new Apply();
    apply.user = await this.user.findOneBy({ id: createApplyDto.userId });
    apply.asset = await this.asset.findOneBy({ id: createApplyDto.assetId });
    return this.apply.save(apply);
  }

  async findAll(query: {
    userId: number;
    status: number;
    pageNum: number;
    pageSize: number;
  }) {
    let qb = this.apply.createQueryBuilder('apply');
    qb = qb
      .where('apply.userId = :userId and apply.status = :status', query)
      .skip(query.pageSize * (query.pageNum - 1))
      .take(query.pageSize);

    const data = await qb.getManyAndCount();

    return {
      total: data[1],
      list: data[0],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} apply`;
  }

  update(id: string, updateBody) {
    return this.apply.update(id, updateBody);
  }
}
