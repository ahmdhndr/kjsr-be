import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { StorageDriver } from '@shared/storage/storage-driver';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';

import {
  CreateMediaDto,
  RemoveMediaDto,
  createMediaSchema,
  removeMediaSchema,
} from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(@Inject('STORAGE_DRIVER') private storage: StorageDriver) {}

  async upload(
    payload: CreateMediaDto,
  ): Promise<{ path: string; fullUrl: string }> {
    try {
      const result = createMediaSchema.safeParse(payload);

      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const { file, folder } = result.data;
      const uploadResult = await this.storage.uploadFile({ file, folder });
      return uploadResult;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async remove(
    payload: RemoveMediaDto,
  ): Promise<{ path: string; deleted: boolean }> {
    try {
      const result = removeMediaSchema.safeParse(payload);

      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const { path } = result.data;
      const uploadResult = await this.storage.deleteFile({ key: path });
      return uploadResult;
    } catch (error) {
      handleServiceError(error);
    }
  }
}
