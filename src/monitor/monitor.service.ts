import { Monitor } from './entities/monitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(Monitor) private readonly monitor: Repository<Monitor>,
  ) {}

  create(createMonitorDto: CreateMonitorDto) {
    return 'This action adds a new monitor';
  }

  async findAll(query) {
    // innerJoinAndSelect会与连接,是是否返回整个实体
    // leftJoinAndSelect会判断是否选择当前的实体
    const qb = this.monitor
      .createQueryBuilder('monitor')
      .innerJoinAndSelect(
        'monitor.applyUser',
        'applyUser',
        'applyUser.userName like :applyUserName',
        {
          applyUserName: '%' + query.applyUserName + '%',
        },
      )
      .innerJoinAndSelect(
        'monitor.handleUser',
        'handleUser',
        'handleUser.userName like :handleUserName',
        {
          handleUserName: '%' + query.handleUserName + '%',
        },
      )
      .innerJoinAndSelect(
        'monitor.asset',
        'asset',
        'asset.name like :assetName',
        {
          assetName: '%' + query.assetName + '%',
        },
      )
      .skip(10 * (query.pageNum - 1))
      .take(10);

    const data = await qb.getManyAndCount();
    return {
      total: data[1],
      list: data[0],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} monitor`;
  }

  update(id: number, updateMonitorDto: UpdateMonitorDto) {
    return `This action updates a #${id} monitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitor`;
  }
}