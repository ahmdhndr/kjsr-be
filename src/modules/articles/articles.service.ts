import { ArticleStatus } from '@common/constants/global.constant';
import {
  ArticlePaginationInterface,
  PaginationInterface,
  QueryPaginationInterface,
} from '@common/interfaces/pagination/pagination.interface';
import { CategoriesService } from '@modules/categories/categories.service';
import { MediaService } from '@modules/media/media.service';
import { User } from '@modules/users/schema/user.schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import content from '@utils/data';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import { FilterQuery, Types } from 'mongoose';

import { ArticlesRepository } from './articles.repository';
import {
  ContentNode,
  UpdateArticleDto,
  updateArticleSchema,
} from './dto/article.dto';
import { Article } from './schema/article.schema';

@Injectable()
export class ArticlesService {
  private baseUrl = process.env.BASE_URL!;
  private source = process.env.NODE_ENV!;
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly categoryService: CategoriesService,
    private readonly mediaService: MediaService,
  ) {}

  async createDraft(authorId: Types.ObjectId): Promise<Article> {
    try {
      const draft = await this.articlesRepository.create({
        author: authorId,
        title: 'Untitled',
        slug: '',
        content,
        coverUrl: '',
        coverPath: '',
        note: '',
        categories: [],
        status: ArticleStatus.DRAFT,
        publishedAt: null,
      });

      return draft;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateArticle(
    filterQuery: FilterQuery<Article>,
    payload: UpdateArticleDto,
  ) {
    try {
      const result = updateArticleSchema.safeParse(payload);

      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const article = await this.articlesRepository.findOne(filterQuery);
      if (!article) {
        throw new NotFoundException('Article not found');
      }
      let slug: string | null = '';
      if (payload.title && payload.title !== article.title) {
        slug = await this.articlesRepository.generateUniqueSlug(
          payload.title,
          article,
        );

        payload.slug = slug;
      } else {
        delete payload.slug;
      }

      const updatedArticle = await this.articlesRepository.findOneAndUpdate(
        article,
        payload,
      );
      return updatedArticle;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async submitForReview(articleId: string, userId: Types.ObjectId) {
    const article = await this.findOwnedArticle(articleId, userId);

    if (article.status !== ArticleStatus.DRAFT) {
      throw new BadRequestException(
        'Article cannot be submitted for review from current status',
      );
    }

    article.status = ArticleStatus.IN_REVIEW;
    return this.articlesRepository.findOneAndUpdate(
      { _id: articleId, author: userId },
      article,
    );
  }

  async reviewArticle(
    articleId: string,
    payload: {
      action: 'approved' | 'need_revision';
      note: string | null;
    },
  ) {
    const article = await this.findArticle(articleId);

    if (article.status !== ArticleStatus.IN_REVIEW) {
      throw new BadRequestException(
        `Article status must be in review. Current status: ${article.status}`,
      );
    }

    if (payload.note === '') {
      throw new BadRequestException('Mohon untuk mengisi catatan.');
    }

    if (payload.action === 'approved') {
      article.status = ArticleStatus.PUBLISHED;
      article.publishedAt = new Date();
    } else {
      article.status = ArticleStatus.NEEDS_REVISION;
    }

    article.note = payload.note;
    return this.articlesRepository.findOneAndUpdate(
      { _id: articleId },
      article,
    );
  }

  async resubmitArticle(
    filterQuery: FilterQuery<Article>,
    payload: UpdateArticleDto,
  ) {
    try {
      const article = await this.articlesRepository.findOne(filterQuery);
      if (!article) {
        throw new NotFoundException('Article not found');
      }

      return this.articlesRepository.findOneAndUpdate(article, payload);
    } catch (error) {
      handleServiceError(error);
    }
  }

  private async findArticle(articleId: string) {
    const article = await this.articlesRepository.findOne({
      _id: articleId,
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  private async findOwnedArticle(articleId: string, userId: Types.ObjectId) {
    const article = await this.articlesRepository.findOne({
      _id: articleId,
      author: userId,
    });
    if (!article)
      throw new NotFoundException('Article not found or not owned by user');
    return article;
  }

  async getArticles(
    queries: ArticlePaginationInterface,
  ): Promise<{ list: Article[]; meta: PaginationInterface }> {
    const page = queries.page ?? 1;
    const limit = queries.limit ?? 10;
    const search = queries.search?.trim();
    const category = queries.category;

    try {
      const query: Record<string, unknown> = {
        status: ArticleStatus.PUBLISHED,
      };

      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      if (category) {
        const categories = category
          .split(',')
          .map((c) => c.trim().toLowerCase());
        if (categories.length) {
          const categoriesDoc =
            await this.categoryService.getCategoriesByName(categories);
          const categoryIds = categoriesDoc.map((doc) => doc._id);
          query.categories = { $in: categoryIds };
        }
      }

      const result = await this.articlesRepository.findPaginatedWithPopulate(
        query,
        {
          page,
          limit,
        },
      );

      return {
        list: result.data,
        meta: result.meta,
      };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getArticleById(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOneWithPopulate({
      _id: new Types.ObjectId(id),
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async getArticlesByUser(
    authorId: Types.ObjectId,
    queries: QueryPaginationInterface,
  ): Promise<{ list: Article[]; meta: PaginationInterface }> {
    const page = queries.page ?? 1;
    const limit = queries.limit ?? 10;
    const search = queries.search?.trim();

    try {
      const query: Record<string, unknown> = {
        author: authorId,
      };

      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      const result = await this.articlesRepository.findPaginatedWithPopulate(
        query,
        {
          page,
          limit,
        },
      );

      return {
        list: result.data,
        meta: result.meta,
      };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getDetailArticleByUser(
    articleId: string,
    authorId: Types.ObjectId,
  ): Promise<Article> {
    const articleByUser = await this.articlesRepository.findOneWithPopulate({
      _id: new Types.ObjectId(articleId),
      author: authorId,
    });

    if (!articleByUser) {
      throw new NotFoundException('Article not found');
    }
    return articleByUser;
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    const article = await this.articlesRepository.findOneWithPopulate({
      slug,
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async deleteArticle(id: string): Promise<Article | null> {
    try {
      const article = await this.articlesRepository.findOne({ _id: id });

      if (!article) {
        throw new NotFoundException('Article not found');
      }

      // check if article has cover url
      let coverPath = '';
      if (article.coverUrl) {
        if (this.source === 'development') {
          coverPath = article.coverUrl.replace(`${this.baseUrl}/uploads/`, '');
        } else {
          coverPath = article.coverUrl.replace(this.baseUrl, '');
        }
        // delete the cover
        await this.mediaService.remove({ path: coverPath });
      }

      // check on article content if its contain image
      await this.deleteImagesFromContent(article.content);

      await this.articlesRepository.findOneAndDelete({ _id: id });
      return null;
    } catch (error) {
      handleServiceError(error);
    }
  }

  private async deleteImagesFromContent(content: ContentNode | null) {
    if (!content?.content) return;

    for (const node of content.content) {
      if (node.type !== 'image') continue;

      const { src } = node.attrs ?? {};
      if (typeof src === 'string' && /^https?:\/\//.test(src)) {
        let imagePath = '';
        if (this.source === 'development') {
          imagePath = src.replace(`${this.baseUrl}/uploads/`, '');
        } else {
          imagePath = src.replace(this.baseUrl, '');
        }
        await this.mediaService.remove({ path: imagePath });
      }
    }
  }

  async listReviewArticle(
    user: User,
    queries: QueryPaginationInterface,
  ): Promise<{ list: Article[]; meta: PaginationInterface }> {
    const page = queries.page ?? 1;
    const limit = queries.limit ?? 10;
    const search = queries.search?.trim();

    try {
      const query: Record<string, unknown> = {
        status: ArticleStatus.IN_REVIEW,
      };

      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      const result = await this.articlesRepository.findPaginatedWithPopulate(
        query,
        {
          page,
          limit,
        },
      );
      const list = result.data.filter((article) => {
        return article.author._id.toString() !== user._id.toString();
      });

      return {
        list,
        meta: {
          ...result.meta,
          total: list.length,
          totalPages: Math.ceil(list.length / limit),
        },
      };
    } catch (error) {
      handleServiceError(error);
    }
  }
}
