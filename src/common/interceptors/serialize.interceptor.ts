import { SUCCESS_RESPONSE_MESSAGE_KEY } from '@common/decorators';
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor<T> {
  new (...args: any[]): T;
}

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly dto: ClassConstructor<T>,
    private readonly reflector: Reflector = new Reflector(),
  ) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const message =
      this.reflector.get<string>(
        SUCCESS_RESPONSE_MESSAGE_KEY,
        context.getHandler(),
      ) ?? 'OK';

    return handler.handle().pipe(
      map((data: T | T[]) => {
        const transformed = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        }) as T | T[];

        return {
          status: 'success',
          message,
          data: transformed,
        };
      }),
    );
  }
}
