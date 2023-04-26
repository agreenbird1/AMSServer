import { User } from 'src/user/entities/user.entity';
import { Asset } from 'src/asset/entities/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenance: Repository<Maintenance>,
  ) {}

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    const maintenance = new Maintenance();
    maintenance.asset = await this.maintenance.manager
      .getMongoRepository(Asset)
      .findOneBy({
        id: createMaintenanceDto.assetId,
      });
    maintenance.applyUser = await this.maintenance.manager
      .getMongoRepository(User)
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
      .leftJoinAndSelect('apply.asset', 'asset')
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

  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    const maintenance = new Maintenance();
    maintenance.maintenanceUser = await this.maintenance.manager
      .getMongoRepository(User)
      .findOneBy({
        id: updateMaintenanceDto.maintenanceUserId,
      });
    // pending 资产内容变更
    return `This action updates a #${id} maintenance`;
  }
}
