import { DeleteStorageDto, UploadStorageDto } from './storage.dto';

export interface StorageDriver {
  uploadFile(
    payload: UploadStorageDto,
  ): Promise<{ path: string; fullUrl: string }>;
  deleteFile(
    payload: DeleteStorageDto,
  ): Promise<{ path: string; deleted: boolean }>;
}
