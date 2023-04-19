import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { SearchUserDto } from './dto/search-user.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.userName = createUserDto.userName;
    user.description = createUserDto.description || '';
    user.avatar =
      createUserDto.avatar ||
      'https://img.juexiaotime.com/adminFile_operation_production/20230419/1111112746/20230419222007_ns77.jpg';
    user.password = createUserDto.password;
    user.phone = createUserDto.phone;
    user.category = await this.categoryService.findOne(
      createUserDto.categoryId,
    );
    return this.user.manager.save(user);
  }

  async findAll(searchUserDto: SearchUserDto) {
    let qb = this.user.createQueryBuilder('user');

    if (searchUserDto.categoryId)
      qb = qb.andWhere('user.categoryId = :categoryId', searchUserDto);
    qb = qb.andWhere(
      `user.userName like :userName and user.phone like :phone`,
      {
        userName: '%' + searchUserDto.userName + '%',
        phone: '%' + searchUserDto.phone + '%',
      },
    );

    qb = qb
      .skip(searchUserDto.pageSize * (searchUserDto.pageNum - 1))
      .take(searchUserDto.pageSize);
    const data = await qb.getManyAndCount();
    return {
      total: data[1],
      list: data[0],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.user.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.user.delete(id);
  }

  async login(body: { phone: string; password: string }) {
    const { phone, password } = body;
    if (!(await this.user.findOneBy({ phone })))
      throw new BusinessException('账号不存在！');
    if (!(await this.user.findOneBy({ phone, password })))
      throw new BusinessException('密码错误！');
    return this.user.findOneBy({ phone, password });
  }

  changeStatus(body: { id: number; status: 0 | 1 }) {
    return this.update(body.id, { status: body.status });
  }

  changeRole(body: { id: number; role: 1 | 2 }) {
    return this.update(body.id, { role: body.role });
  }

  checkRepeatAccount(body: { phone: string }) {
    return !!this.user.findOneBy(body);
  }
}
