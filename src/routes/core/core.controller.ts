import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDefinition } from 'src/common';
import { CoreService } from './core.service';

@ApiTags('Setup')
@Controller('/setup')
export class CoreController {
  constructor(private readonly setupService: CoreService) {}

  @Post('/categories')
  @ApiDefinition({ summary: '(시드 데이터) 카테고리 생성', isPublic: true })
  async setupCategories() {
    const categories = await this.setupService.setupCategories(); // *await
    return { categories };
  }

  @Get('/categories')
  @ApiDefinition({ summary: '모든 카테고리 목록 조회', isPublic: true })
  async findCategoryTrees() {
    const categories = await this.setupService.findCategoryTrees(); // *await
    return { categories };
  }
}
