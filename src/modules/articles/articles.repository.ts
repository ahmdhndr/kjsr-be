import { AbstractRepository } from '@common/abstracts/mongo/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import slugify from 'slugify';

import { Article } from './schema/article.schema';

const POPULATE = {
  CATEGORY: { path: 'categories', select: 'id name' },
  AUTHOR: { path: 'author', select: 'id username firstName lastName email' },
};

@Injectable()
export class ArticlesRepository extends AbstractRepository<Article> {
  protected readonly logger = new Logger(ArticlesRepository.name);

  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<Article>,
  ) {
    super(articleModel);
  }

  async generateUniqueSlug(title: string, article: Article): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // cek slug yang sudah ada di db
    while (
      await this.articleModel.exists({ slug, _id: { $ne: article._id } })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async findWithPopulate() {
    const articles = await this.articleModel
      .find()
      .populate(POPULATE.CATEGORY)
      .populate(POPULATE.AUTHOR);

    return articles;
  }

  async findOneWithPopulate(filterQuery: FilterQuery<Article>) {
    const article = await this.articleModel
      .findOne(filterQuery)
      .populate(POPULATE.CATEGORY)
      .populate(POPULATE.AUTHOR);

    return article;
  }

  async findPaginatedWithPopulate(
    filterQuery: FilterQuery<Article>,
    options: { page: number; limit: number; sort?: Record<string, 1 | -1> },
  ) {
    const { page, limit, sort = { updatedAt: -1 } } = options;

    const [data, total] = await Promise.all([
      this.articleModel
        .find(filterQuery)
        .populate(POPULATE.CATEGORY)
        .populate(POPULATE.AUTHOR)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      this.articleModel.countDocuments(filterQuery),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
