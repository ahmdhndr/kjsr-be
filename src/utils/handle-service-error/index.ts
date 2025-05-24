import { HttpException, InternalServerErrorException } from '@nestjs/common';

export function handleServiceError(error: unknown): never {
  if (
    error instanceof HttpException &&
    error.getStatus() >= 400 &&
    error.getStatus() < 500
  ) {
    throw error;
  }

  throw new InternalServerErrorException('Internal server error');
}
