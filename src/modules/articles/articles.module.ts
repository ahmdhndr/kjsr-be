import { CategoriesModule } from '@modules/categories/categories.module';
import { MediaModule } from '@modules/media/media.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArticlesController } from './articles.controller';
import { ArticlesRepository } from './articles.repository';
import { ArticlesService } from './articles.service';
import { DashboardArticlesController } from './dashboard-atricles.controller';
import { Article, ArticlesSchema } from './schema/article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: ArticlesSchema,
      },
    ]),
    CategoriesModule,
    MediaModule,
  ],
  controllers: [ArticlesController, DashboardArticlesController],
  providers: [ArticlesService, ArticlesRepository],
  exports: [ArticlesService],
})
export class ArticlesModule {}
