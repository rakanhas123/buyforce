import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':slug/products')
  getFeed(
    @Param('slug') slug: string,
    @Query('sort') sort = 'nearGoal',
    @Query('page') pageStr = '1',
    @Query('pageSize') pageSizeStr = '12',
  ) {
    const page = Math.max(1, Number(pageStr) || 1);
    const pageSize = Math.min(30, Math.max(6, Number(pageSizeStr) || 12));
    const s = (sort === 'nearGoal' || sort === 'discount' || sort === 'new') ? sort : 'nearGoal';

    return this.service.getCategoryFeed(slug, s, page, pageSize);
  }
}
