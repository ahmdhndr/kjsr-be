import { PaginationInterface } from '@common/interfaces/pagination/pagination.interface';
import { Expose, Type } from 'class-transformer';
import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string({ message: 'property `name` is missing' })
    .nonempty('Name cannot be empty'),
  description: z
    .string({ message: 'property `description` is missing' })
    .nullable(),
  iconUrl: z.string({ message: 'property `iconUrl` is missing' }).nullable(),
  iconPath: z.string({ message: 'property `iconPath` is missing' }).nullable(),
});

export type CategoryDto = z.infer<typeof categorySchema>;

export class SerializeCategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  iconUrl: string;

  @Expose()
  iconPath: string;
}

export class ListCategoryDto {
  @Expose()
  @Type(() => SerializeCategoryDto)
  list: SerializeCategoryDto;

  @Expose()
  meta: PaginationInterface;
}
