import { Expose } from 'class-transformer';
import { z } from 'zod';

export const createMediaSchema = z.object({
  file: z.custom<Express.Multer.File>(
    (file: Express.Multer.File) =>
      file && typeof file === 'object' && 'originalname' in file,
    { message: 'File is required' },
  ),
  folder: z.string().optional(),
});
export const removeMediaSchema = z.object({
  path: z.string({ message: 'File path is required' }),
});

export type CreateMediaDto = z.infer<typeof createMediaSchema>;
export type RemoveMediaDto = z.infer<typeof removeMediaSchema>;

export class SerializedMediaDto {
  @Expose()
  path: string;

  @Expose()
  fullUrl: string;

  @Expose()
  deleted: boolean;
}
