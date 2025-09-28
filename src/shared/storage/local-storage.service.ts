import { BadRequestException, Injectable } from '@nestjs/common';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { promises as fs } from 'fs';
import * as path from 'path';

import { StorageDriver } from './storage-driver';
import {
  DeleteStorageDto,
  UploadStorageDto,
  deleteStorageSchema,
  uploadStorageSchema,
} from './storage.dto';

@Injectable()
export class LocalStorageService implements StorageDriver {
  private uploadPath = path.join(process.cwd(), 'uploads');

  async uploadFile(payload: UploadStorageDto) {
    const result = uploadStorageSchema.safeParse(payload);
    if (!result.success) {
      throw new BadRequestException({
        message: extractFirstZodError(result.error.format()),
      });
    }

    const { file, folder } = result.data;
    const now = new Date();
    const dateFolder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${file.originalname}`;

    const dir = path.join(this.uploadPath, folder || '', dateFolder);
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, uniqueFileName);

    await fs.writeFile(filePath, file.buffer);

    const relativePath = path.relative(this.uploadPath, filePath);

    return {
      path: relativePath,
      fullUrl: `http://localhost:5000/uploads/${relativePath}`, // bisa serve via static files
    };
  }

  async deleteFile(payload: DeleteStorageDto) {
    const result = deleteStorageSchema.safeParse(payload);
    if (!result.success) {
      throw new BadRequestException({
        message: extractFirstZodError(result.error.format()),
      });
    }

    const { key } = result.data;
    const filePath = path.join(this.uploadPath, key);
    await fs.unlink(filePath);

    return { path: key, deleted: true };
  }
}
