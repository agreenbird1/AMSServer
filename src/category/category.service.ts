import { Asset } from 'src/asset/entities/asset.entity';
import { User } from 'src/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Equal, Repository } from 'typeorm';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly category: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const data = new Category();
    console.log('Category', createCategoryDto);
    data.name = createCategoryDto.name;
    data.type = createCategoryDto.type;
    if (createCategoryDto.parentId) {
      data.parent = await this.findOne(createCategoryDto.parentId);
    }
    return this.category.save(data);
  }

  async findAll(type: 1 | 2) {
    const trees = await this.category.manager
      .getTreeRepository(Category)
      .findTrees();

    return trees.filter((tree) => tree.type == type);
  }

  async findOne(id: number) {
    const data = await this.category.find({
      where: {
        id: Equal(id),
      },
    });
    return data[0];
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.category.manager
      .getTreeRepository(Category)
      .update(id, updateCategoryDto);
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    const category = await this.category.findOneBy({ id });
    if (category.type == 1) {
      const assets = await this.category.manager.getRepository(Asset).find({
        where: {
          category,
        },
      });
      if (assets.length)
        throw new BusinessException('分类下存在资产不可删除！');
    } else {
      const users = await this.category.manager.getRepository(User).find({
        where: {
          category,
        },
      });
      if (users.length) throw new BusinessException('分类下存在用户不可删除！');
    }
    await this.category.manager.getTreeRepository(Category).delete(id);
    return `This action removes a #${id} category`;
  }
}
