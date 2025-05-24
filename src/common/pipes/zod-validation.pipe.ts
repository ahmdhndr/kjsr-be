import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: extractFirstZodError(result.error.format()),
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data;
  }
}
