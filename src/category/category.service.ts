import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Equal, Repository } from 'typeorm';

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
    await this.category.manager.getTreeRepository(Category).delete(id);
    return `This action removes a #${id} category`;
  }
}
