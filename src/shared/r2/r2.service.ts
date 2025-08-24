import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';

import {
  DeleteR2Dto,
  UploadR2Dto,
  deleteR2Schema,
  uploadR2Schema,
} from './dto/r2.dto';

@Injectable()
export class R2Service {
  private s3: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${this.configService.get<string>('R2_ACCOUNT_ID')!}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'R2_SECRET_ACCESS_KEY',
        )!,
      },
    });

    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME')!;
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL')!;
  }

  async uploadFile(
    payload: UploadR2Dto,
  ): Promise<{ path: string; fullUrl: string }> {
    try {
      const result = uploadR2Schema.safeParse(payload);

      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const { file, folder } = result.data;
      // Generate folder per date
      const now = new Date();
      const dateFolder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

      // generate name
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${file.originalname}`;
      let key = '';

      // Construct the key
      if (folder) {
        key = `${folder}/${dateFolder}/${uniqueFileName}`;
      } else {
        key = `${dateFolder}/${uniqueFileName}`;
      }

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return {
        path: key,
        fullUrl: `${this.publicUrl}/${key}`,
      };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteFile(
    payload: DeleteR2Dto,
  ): Promise<{ path: string; deleted: boolean }> {
    try {
      const result = deleteR2Schema.safeParse(payload);

      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const { key } = result.data;
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      return { path: key, deleted: true };
    } catch (error) {
      handleServiceError(error);
    }
  }
}
