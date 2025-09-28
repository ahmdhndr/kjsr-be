import { ArticleStatus } from '@common/constants/global.constant';
import { PaginationInterface } from '@common/interfaces/pagination/pagination.interface';
import { SerializeCategoryDto } from '@modules/categories/dto/category.dto';
import { SerializeUserDto } from '@modules/users/dto/serialize-user.dto';
import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { z } from 'zod';

export const contentNodeSchema = z.object({
  type: z.string(),
  attrs: z.record(z.any()).optional(),
  content: z
    .lazy(
      () =>
        z.array(contentNodeSchema) as z.ZodType<
          Array<z.infer<typeof contentNodeSchema>>
        >,
    )
    .optional(),
  text: z.string().optional(),
});

export const articleSchema = z.object({
  title: z
    .string({ message: 'property `title` is missing' })
    .nonempty('Title cannot be empty'),
  coverUrl: z.string({ message: 'property `coverUrl` is missing' }).nullable(),
  categories: z.array(z.string()).default([]),
  status: z
    .nativeEnum(ArticleStatus, {
      errorMap: () => ({ message: 'invalid article status' }),
    })
    .default(ArticleStatus.DRAFT),
  publishedAt: z.date().nullable().default(null),
  slug: z.string().optional(),
  content: z
    .object({
      type: z.literal('doc'),
      content: z.lazy(
        () =>
          z.array(contentNodeSchema) as z.ZodType<
            Array<z.infer<typeof contentNodeSchema>>
          >,
      ),
    })
    .nullable()
    .default(null),
  coverPath: z.string().nullable(),
  note: z.string().optional().default(''),
});

export const updateArticleSchema = articleSchema.partial();

export type ArticleDto = z.infer<typeof articleSchema>;
export type UpdateArticleDto = z.infer<typeof updateArticleSchema>;
export type ContentNode = {
  type?: string;
  attrs?: Record<string, string | number>;
  content?: ContentNode[];
  marks?: {
    type: string;
    attrs?: Record<string, unknown>;
    [key: string]: unknown;
  }[];
  text?: string;
  [key: string]: unknown;
};

export class SerializeArticleDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => SerializeUserDto)
  author: SerializeUserDto;

  @Expose()
  coverUrl: string;

  @Expose()
  coverPath: string;

  @Expose()
  @Type(() => SerializeCategoryDto)
  categories: SerializeCategoryDto[];

  @Expose()
  note: string;

  @Expose()
  status: string;

  @Expose()
  publishedAt: string;

  @Expose()
  slug: string;

  @Expose()
  updatedAt: string;
}

export class SerializeArticleDashboardDto extends OmitType(
  SerializeArticleDto,
  ['author', 'slug', 'publishedAt'] as const,
) {}

export class ListArticleDto {
  @Expose()
  @Type(() => SerializeArticleDto)
  list: SerializeArticleDto;

  @Expose()
  meta: PaginationInterface;
}

export class ListArticleDashboardDto {
  @Expose()
  @Type(() => SerializeArticleDashboardDto)
  list: SerializeArticleDashboardDto;

  @Expose()
  meta: PaginationInterface;
}
