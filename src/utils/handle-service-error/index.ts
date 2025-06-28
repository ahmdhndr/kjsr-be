import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

export function handleServiceError(error: unknown): never {
  if (error instanceof TokenExpiredError) {
    throw new HttpException('Token expired', 401);
  }

  if (error instanceof JsonWebTokenError) {
    throw new HttpException('Invalid token', 401);
  }

  if (
    error instanceof HttpException &&
    error.getStatus() >= 400 &&
    error.getStatus() < 500
  ) {
    throw error;
  }

  throw new InternalServerErrorException('Internal server error');
}
