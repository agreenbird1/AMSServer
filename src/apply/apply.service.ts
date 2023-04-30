import { Maintenance } from './../maintenance/entities/maintenance.entity';
import { Monitor } from './../monitor/entities/monitor.entity';
import { Injectable } from '@nestjs/common';
import { CreateApplyDto } from './dto/create-apply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from 'src/asset/entities/asset.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Apply } from './entities/apply.entity';
import CalConsumeValue from '../utils/CalConsumeValue';
import * as dayjs from 'dayjs';

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
      await this.apply.manager.getRepository(Asset).update(apply.asset.id, {
        surplusQuantity: apply.asset.surplusQuantity - 1,
      });
      await this.apply.save(apply);
    }
    return 'success';
  }

  async findAll(query: { userId: number; status: number; pageNum: number }) {
    let qb = this.apply.createQueryBuilder('apply');
    qb = qb
      .where('apply.userId = :userId and apply.status = :status', query)
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

  async findMyAssetsAll(query: {
    userId: number;
    myStatus: number;
    pageNum: number;
  }) {
    let qb = this.apply.createQueryBuilder('apply');
    qb = qb
      .where('apply.userId = :userId and apply.myStatus = :myStatus', query)
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
    const apply = await this.apply
      .createQueryBuilder('apply')
      .leftJoinAndSelect('apply.user', 'user')
      .leftJoinAndSelect('apply.asset', 'asset')
      .leftJoinAndSelect('apply.approveUser', 'approveUser')
      .where('apply.id = :id', { id })
      .getOne();
    if (updateBody.approveUserId) {
      apply.approveUser = await this.apply.manager
        .getRepository(User)
        .findOneBy({ id: updateBody.approveUserId });
      delete updateBody.approveUserId;
      // 资产批准后同步到监控表
      await this.apply.manager.getRepository(Monitor).save({
        type: 2,
        applyUser: apply.user,
        handleUser: apply.approveUser,
        asset: apply.asset,
      });
    }
    // 签收后移入我的资产
    if (updateBody.status == 5) updateBody.myStatus = 1;
    // 退还移入监控表
    if (updateBody.myStatus == 3) {
      // 需要计算消耗的价值
      await this.apply.manager.getRepository(Asset).update(apply.asset.id, {
        depreciationValue:
          apply.asset.depreciationValue -
          CalConsumeValue(apply.signTime, apply.asset.amount),
      });
      await this.apply.manager.getRepository(Monitor).save({
        type: 4,
        applyUser: apply.user,
        handleUser: apply.approveUser,
        asset: apply.asset,
        useTime: dayjs(dayjs(new Date())).diff(apply.signTime, 'days'),
      });
    }

    return this.apply.update(id, {
      ...apply,
      ...updateBody,
      returnTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  async maintenance(id: number, updateBody) {
    const apply = await this.apply
      .createQueryBuilder('apply')
      .leftJoinAndSelect('apply.user', 'user')
      .leftJoinAndSelect('apply.asset', 'asset')
      .leftJoinAndSelect('apply.approveUser', 'approveUser')
      .where('apply.id = :id', { id })
      .getOne();
    // 报修移入维修表
    const maintenance = await this.apply.manager
      .getRepository(Maintenance)
      .save({
        picture: updateBody.picture,
        description: updateBody.description,
        asset: apply.asset,
        applyUser: apply.user,
        apply: apply,
      });
    // 报修移入监控表
    await this.apply.manager.getRepository(Monitor).save({
      type: 3,
      applyUser: apply.user,
      handleUser: apply.approveUser,
      asset: apply.asset,
      maintenance,
    });
    return this.update(id, { myStatus: 2 });
  }
}
