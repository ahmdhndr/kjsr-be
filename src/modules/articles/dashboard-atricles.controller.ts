import { SuccessResponseMessage } from '@common/decorators';
import { CurrentUser } from '@common/decorators/current-user';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { Serialize } from '@common/interceptors';
import { QueryPaginationInterface } from '@common/interfaces/pagination/pagination.interface';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { User } from '@modules/users/schema/user.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ArticlesService } from './articles.service';
import {
  ArticleDto,
  ListArticleDashboardDto,
  ListArticleDto,
  SerializeArticleDashboardDto,
  SerializeArticleDto,
} from './dto/article.dto';

@Controller('dashboard/articles')
export class DashboardArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Serialize(SerializeArticleDashboardDto)
  @SuccessResponseMessage('Article created')
  async createArticle(@CurrentUser() user: User) {
    const authorId = user._id;
    return this.articlesService.createDraft(authorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(SerializeArticleDashboardDto)
  @SuccessResponseMessage('Article updated')
  async updateArticle(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() body: ArticleDto,
  ) {
    return this.articlesService.updateArticle(
      {
        _id: id,
        author: user._id,
      },
      body,
    );
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(SerializeArticleDashboardDto)
  @SuccessResponseMessage('Article submitted for review')
  async submitForReview(@Param('id') id: string, @CurrentUser() user: User) {
    return this.articlesService.submitForReview(id, user._id);
  }

  @Post(':id/review')
  @UseGuards(JwtAuthGuard)
  @Serialize(SerializeArticleDashboardDto)
  async reviewArticle(
    @Param('id') id: string,
    @Body() payload: { action: 'approved' | 'need_revision'; note: string },
  ) {
    return this.articlesService.reviewArticle(id, payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Serialize(ListArticleDashboardDto, { groups: ['dashboard'] })
  async getArticlesByUser(
    @CurrentUser() user: User,
    @Query() query: QueryPaginationInterface,
  ) {
    const result = await this.articlesService.getArticlesByUser(
      user._id,
      query,
    );

    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(SerializeArticleDashboardDto)
  async getDetailArticleByUser(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const article = await this.articlesService.getDetailArticleByUser(
      id,
      user._id,
    );
    return article;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @SuccessResponseMessage('Article deleted')
  @Serialize(SerializeArticleDashboardDto)
  async deleteArticle(@Param('id') id: string) {
    return this.articlesService.deleteArticle(id);
  }

  @Get('review/list')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serialize(ListArticleDto)
  async listArticleForReviews(
    @CurrentUser() user: User,
    @Query() query: QueryPaginationInterface,
  ) {
    const result = await this.articlesService.listReviewArticle(user, query);

    return result;
  }

  @Get('review/:id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serialize(SerializeArticleDto)
  @SuccessResponseMessage('Thanks for reviewing')
  async detailArticleReview(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }
}
