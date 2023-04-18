import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.userName = createUserDto.userName;
    user.avatar = createUserDto.avatar;
    user.description = createUserDto.description;
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
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  login(body: any) {
    console.log(body);
    return 'this is login api!';
  }
}
