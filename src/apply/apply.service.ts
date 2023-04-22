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
  ) {}

  async create(createApplyDto: CreateApplyDto) {
    const user = await this.apply.manager
      .getRepository(User)
      .findOneBy({ id: createApplyDto.userId });
    for (let index = 0; index < createApplyDto.assetIds.length; index++) {
      const assetId = createApplyDto.assetIds[index];
      const apply = new Apply();
      apply.user = user;
      apply.asset = await this.apply.manager
        .getRepository(Asset)
        .findOneBy({ id: assetId });
      // 申请这个物品后数量减一
      this.apply.manager.getRepository(Asset).update(apply.asset.id, {
        quantity: apply.asset.quantity - 1,
      });
      this.apply.save(apply);
    }
    return 'success';
  }

  async findAll(query: { userId: number; status: number; pageNum: number }) {
    let qb = this.apply.createQueryBuilder('apply');
    qb = qb
      .where('apply.userId = :userId and apply.status = :status', query)
      .leftJoinAndSelect('apply.user', 'user')
      .leftJoinAndSelect('apply.asset', 'asset')
      .skip(10 * (query.pageNum - 1))
      .take(10);

    const data = await qb.getManyAndCount();

    return {
      total: data[1],
      list: data[0],
    };
  }

  async findApprovalAll(query: {
    status: number;
    pageNum: number;
    approveUserId: number;
  }) {
    let qb = this.apply.createQueryBuilder('apply');
    if (query.status == 1) qb = qb.where('apply.status = :status', query);
    else
      qb = qb.where(
        'apply.status != :status and apply.approveUserId = :approveUserId',
        {
          status: 1,
          approveUserId: query.approveUserId,
        },
      );

    qb = qb
      .leftJoinAndSelect('apply.user', 'user')
      .leftJoinAndSelect('apply.asset', 'asset')
      .leftJoinAndSelect('apply.approveUser', 'approveUser')
      .skip(10 * (query.pageNum - 1))
      .take(10);

    const data = await qb.getManyAndCount();
    return {
      total: data[1],
      list: data[0],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} apply`;
  }

  async update(id: number, updateBody) {
    const apply = await this.apply.findOneBy({ id });
    console.log('apply', apply);
    console.log('updateBody', updateBody);
    if (updateBody.approveUserId) {
      apply.approveUser = await this.apply.manager
        .getRepository(User)
        .findOneBy({ id: updateBody.approveUserId });
      delete updateBody.approveUserId;
    }

    return this.apply.update(id, {
      ...apply,
      ...updateBody,
    });
  }
}
