import { SuccessResponseMessage } from '@common/decorators';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { Serialize } from '@common/interceptors';
import { QueryPaginationInterface } from '@common/interfaces/pagination/pagination.interface';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
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

import { CategoriesService } from './categories.service';
import {
  CategoryDto,
  ListCategoryDto,
  SerializeCategoryDto,
} from './dto/category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serialize(SerializeCategoryDto)
  @SuccessResponseMessage('Category created successfully!')
  async createCategory(@Body() payload: CategoryDto) {
    const newCategory = await this.categoriesService.createCategory(payload);
    return newCategory;
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serialize(SerializeCategoryDto)
  @SuccessResponseMessage('Category updated successfully!')
  async updateCategory(@Param('id') id: string, @Body() payload: CategoryDto) {
    const updatedCategory = await this.categoriesService.updateCategory(
      { _id: id },
      payload,
    );
    return updatedCategory;
  }

  @Get()
  @Serialize(ListCategoryDto)
  async getAllCategories(@Query() query: QueryPaginationInterface) {
    const result = await this.categoriesService.findAllCategories(query);
    return {
      list: result.data,
      meta: result.meta,
    };
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serialize(SerializeCategoryDto)
  @SuccessResponseMessage('Category deleted successfully!')
  async deleteCategory(@Param('id') id: string) {
    const deletedCategory = await this.categoriesService.deleteCategory(id);
    return deletedCategory;
  }
}
