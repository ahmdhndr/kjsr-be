import { PaginationInterface } from '@common/interfaces/pagination/pagination.interface';
import { MediaService } from '@modules/media/media.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import { FilterQuery } from 'mongoose';

import { CategoriesRepository } from './categories.repository';
import { CategoryDto, categorySchema } from './dto/category.dto';
import { Category } from './schema/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly mediaService: MediaService,
  ) {}

  async createCategory(data: CategoryDto): Promise<Category> {
    try {
      const result = categorySchema.safeParse(data);

      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const newCategory = await this.categoriesRepository.create(data);

      return newCategory;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateCategory(
    filterQuery: FilterQuery<Category>,
    data: Partial<Category>,
  ): Promise<Category> {
    try {
      const result = categorySchema.partial().safeParse(data);

      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }
      const category = await this.categoriesRepository.findOne(filterQuery);

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const updatedCategory = await this.categoriesRepository.findOneAndUpdate(
        category,
        data,
      );

      return updatedCategory;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async findAllCategories(queries: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: Category[]; meta: PaginationInterface }> {
    const page = queries.page ?? 1;
    const limit = queries.limit ?? 10;
    const search = queries.search?.trim();

    try {
      const query: Record<string, unknown> = {};

      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
        ];
      }

      const result = await this.categoriesRepository.findPaginated(query, {
        page,
        limit,
      });

      return result;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteCategory(id: string): Promise<Category | null> {
    try {
      const category = await this.categoriesRepository.findOne({ _id: id });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // check if category has iconUrl and iconPath
      if (category.iconUrl && category.iconPath) {
        // delete the icon file from media service
        await this.mediaService.remove({ path: category.iconPath });
      }

      await this.categoriesRepository.findOneAndDelete({ _id: id });
      return null;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getCategoriesByName(names: string[]) {
    try {
      const nameRegex = names.map((name) => new RegExp(name, 'i'));

      const categories = await this.categoriesRepository.find({
        $or: nameRegex.map((regex) => ({ name: { $regex: regex } })),
      });

      return categories;
    } catch (error) {
      handleServiceError(error);
    }
  }
}
