import { PaginationInterface } from '@common/interfaces/pagination/pagination.interface';
import { Logger, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  PopulateOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return createdDocument.save();
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    const document = await this.model.findOne(filterQuery);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      return null;
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      new: true,
    });

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(filterQuery);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndDelete(filterQuery);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findRaw(
    filterQuery: FilterQuery<TDocument>,
    options?: { populate?: PopulateOptions | (string | PopulateOptions)[] },
  ) {
    let query = this.model.find(filterQuery);
    if (options?.populate) {
      query = query.populate(options.populate);
    }
    return query;
  }

  async findPaginated(
    filterQuery: FilterQuery<TDocument>,
    options: {
      page: number;
      limit: number;
      sort?: Record<string, 1 | -1>;
      populate?: PopulateOptions | (string | PopulateOptions)[];
    },
  ): Promise<{ list: TDocument[]; meta: PaginationInterface }> {
    const { page, limit, sort = { createdAt: -1 }, populate } = options;

    let q = this.model
      .find(filterQuery)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    if (populate) {
      q = q.populate(populate);
    }

    const [list, total] = await Promise.all([
      q,
      this.model.countDocuments(filterQuery),
    ]);

    return {
      list,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
