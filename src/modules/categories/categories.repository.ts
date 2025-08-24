import { AbstractRepository } from '@common/abstracts/mongo/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category } from './schema/category.schema';

@Injectable()
export class CategoriesRepository extends AbstractRepository<Category> {
  protected readonly logger = new Logger(CategoriesRepository.name);

  constructor(
    @InjectModel(Category.name)
    userModel: Model<Category>,
  ) {
    super(userModel);
  }
}
