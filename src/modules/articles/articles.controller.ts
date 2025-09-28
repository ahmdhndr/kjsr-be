import { Serialize } from '@common/interceptors';
import { QueryPaginationInterface } from '@common/interfaces/pagination/pagination.interface';
import { Controller, Get, Param, Query } from '@nestjs/common';

import { ArticlesService } from './articles.service';
import { ListArticleDto, SerializeArticleDto } from './dto/article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  @Get()
  @Serialize(ListArticleDto, { groups: ['public'] })
  async listArticles(@Query() query: QueryPaginationInterface) {
    const result = await this.articlesService.getArticles(query);
    return result;
  }

  @Get(':slug')
  @Serialize(SerializeArticleDto)
  async getDetailArticle(@Param('slug') slug: string) {
    return this.articlesService.getArticleBySlug(slug);
  }
}
