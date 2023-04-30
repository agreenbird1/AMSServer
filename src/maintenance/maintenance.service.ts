import { Apply } from './../apply/entities/apply.entity';
import { Monitor } from './../monitor/entities/monitor.entity';
import { User } from 'src/user/entities/user.entity';
import { Asset } from 'src/asset/entities/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';
import { Repository } from 'typeorm';
import getTime from 'src/utils/getTime';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenance: Repository<Maintenance>,
  ) {}

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    const maintenance = new Maintenance();
    maintenance.asset = await this.maintenance.manager
      .getRepository(Asset)
      .findOneBy({
        id: createMaintenanceDto.assetId,
      });
    maintenance.applyUser = await this.maintenance.manager
      .getRepository(User)
      .findOneBy({
        id: createMaintenanceDto.applyUserId,
      });
    maintenance.description = createMaintenanceDto.description;
    maintenance.picture = createMaintenanceDto.picture;

    return this.maintenance.save(maintenance);
  }

  async findAll(query) {
    let qb = this.maintenance.createQueryBuilder('maintenance');
    qb = qb.where('maintenance.status = :status', query);
    if (query.userId) {
      qb = qb.andWhere('maintenance.maintenanceUser = :userId', query);
    }
    qb = qb
      .leftJoinAndSelect('maintenance.applyUser', 'applyUser')
      .leftJoinAndSelect('maintenance.asset', 'asset')
      .leftJoinAndSelect('maintenance.apply', 'apply')
      .skip(10 * (query.pageNum - 1))
      .take(10);

    const data = await qb.getManyAndCount();

    return {
      total: data[1],
      list: data[0],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} maintenance`;
  }

  async update(id: number, updateMaintenanceDto) {
    console.log('updateMaintenanceDto', updateMaintenanceDto);
    const maintenance = await this.maintenance
      .createQueryBuilder('maintenance')
      .leftJoinAndSelect('maintenance.apply', 'apply')
      .where('maintenance.id = :id', { id })
      .getOne();
    const { status, maintenanceValue, maintenanceUserId, assetId } =
      updateMaintenanceDto;
    const user = await this.maintenance.manager.getRepository(User).findOneBy({
      id: maintenanceUserId,
    });
    const assetRepository = this.maintenance.manager.getRepository(Asset);
    const asset = await assetRepository.findBy({ id: assetId });
    if (status == 0) {
      // 报废
      this.maintenance.manager.getRepository(Monitor).save({
        type: 5,
        handleUser: user,
        applyUser: user,
        asset: asset[0],
      });
      this.maintenance.manager.getRepository(Apply).save({
        id: maintenance.apply.id,
        myStatus: 4,
        scrapTime: getTime(),
      });
      asset[0].scrapValue += asset[0].amount;
      asset[0].scrapNumber += 1;
      assetRepository.save(asset[0]);
    } else {
      asset[0].depreciationValue -= maintenanceValue;
      // 维修完成的重置我的资产
      this.maintenance.manager.getRepository(Apply).save({
        id: maintenance.apply.id,
        myStatus: 1,
        maintenanceTime: getTime(),
      });
      asset[0].maintenanceValue += maintenanceValue;
      asset[0].maintenanceNumber += 1;
      assetRepository.save(asset[0]);
    }
    maintenance.maintenanceUser = user;
    maintenance.status = 1;
    return this.maintenance.save(maintenance);
  }
}
