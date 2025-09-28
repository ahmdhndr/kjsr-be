import { z } from 'zod';

export const uploadStorageSchema = z.object({
  file: z.custom<Express.Multer.File>(
    (file: Express.Multer.File) =>
      file && typeof file === 'object' && 'originalname' in file,
    { message: 'File is required' },
  ),
  folder: z.string().optional(),
});
export const deleteStorageSchema = z.object({
  key: z.string({ message: 'File path is required' }),
});

export type UploadStorageDto = z.infer<typeof uploadStorageSchema>;
export type DeleteStorageDto = z.infer<typeof deleteStorageSchema>;
