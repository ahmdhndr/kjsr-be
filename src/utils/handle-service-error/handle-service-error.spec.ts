import { HttpException, InternalServerErrorException } from '@nestjs/common';

import { handleServiceError } from '.';

describe('handleServiceError function', () => {
  it('should handle HttpException correctly', () => {
    const error = new HttpException('Test error', 400);
    expect(() => handleServiceError(error)).toThrow(HttpException);
  });

  it('should handle InternalServerErrorException correctly', () => {
    const error = new InternalServerErrorException('Test error');
    expect(() => handleServiceError(error)).toThrow(
      InternalServerErrorException,
    );
  });
});
