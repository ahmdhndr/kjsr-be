import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    name: z.string().min(1),
    age: z.number().min(0),
  });

  const pipe = new ZodValidationPipe(schema);

  it('should return value if valid', () => {
    const value = { name: 'John', age: 25 };
    expect(pipe.transform(value, {} as any)).toEqual(value);
  });

  it('should throw BadRequestException if invalid', () => {
    const invalidValue = { name: '', age: -5 };

    try {
      pipe.transform(invalidValue, {} as any);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.getResponse()).toHaveProperty('message');
    }
  });
});
