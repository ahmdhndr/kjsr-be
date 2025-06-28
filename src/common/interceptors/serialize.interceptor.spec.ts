import { RegisterResponseDto } from '@modules/users/dto/register-response.dto';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';

import { SerializeInterceptor } from './serialize.interceptor';

describe('SerializeInterceptor', () => {
  let interceptor: SerializeInterceptor<RegisterResponseDto>;
  let mockReflector: Reflector;

  beforeEach(() => {
    mockReflector = new Reflector();
    interceptor = new SerializeInterceptor(RegisterResponseDto, mockReflector);
  });

  it('should serialize data correctly', (done) => {
    const mockContext: Partial<ExecutionContext> = {
      getHandler: jest.fn(() => () => {}),
    };

    const mockHandler: CallHandler = {
      handle: () => of('Hello john'),
    };

    jest.spyOn(mockReflector, 'get').mockReturnValueOnce('Success response!');

    interceptor
      .intercept(mockContext as ExecutionContext, mockHandler)
      .subscribe((result) => {
        expect(result).toEqual({
          status: 'success',
          message: 'Success response!',
          data: 'Hello john',
        });
        done();
      });
  });

  it('should handle default message correctly', (done) => {
    const mockContext: Partial<ExecutionContext> = {
      getHandler: jest.fn(() => () => {}),
    };

    const mockHandler: CallHandler = {
      handle: () => of('Hello john'),
    };

    jest.spyOn(mockReflector, 'get').mockReturnValueOnce(undefined);

    interceptor
      .intercept(mockContext as ExecutionContext, mockHandler)
      .subscribe((result) => {
        expect(result).toEqual({
          status: 'success',
          message: 'OK',
          data: 'Hello john',
        });
        done();
      });
  });
});
