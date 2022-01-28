import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, CategoryNameEnum } from 'src/entities';
import { CommandManager } from 'src/entities/@commands';
import { TreeRepository } from 'typeorm';

@Injectable()
export class CoreService {
  public categoryCommand: CommandManager<Category>;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore https://github.com/nestjs/nest/issues/2834
    this.categoryCommand = CommandManager(this.categoryRepository);
  }

  async setupCategories() {
    await this.categoryCommand.hardDeleteMany({});

    const categories = [];
    for (const key in CategoryNameEnum) {
      const category = await this.categoryCommand.createOne({
        name: CategoryNameEnum[key],
        description: 'test',
      });
      categories.push(category);
    }

    return categories;
  }

  /** Queries */
  async findCategoryTrees() {
    const categories = await this.categoryRepository.findTrees();
    return categories;
  }
}
