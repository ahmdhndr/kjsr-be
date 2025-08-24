import { z } from 'zod';

export const uploadR2Schema = z.object({
  file: z.custom<Express.Multer.File>(
    (file: Express.Multer.File) =>
      file && typeof file === 'object' && 'originalname' in file,
    { message: 'File is required' },
  ),
  folder: z.string().optional(),
});
export const deleteR2Schema = z.object({
  key: z.string({ message: 'File path is required' }),
});

export type UploadR2Dto = z.infer<typeof uploadR2Schema>;
export type DeleteR2Dto = z.infer<typeof deleteR2Schema>;
