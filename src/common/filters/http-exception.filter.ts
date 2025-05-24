/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const statusText = status >= 500 ? 'error' : 'failed';
    const responseMessage =
      typeof message === 'string' ? message : (message as any)?.message;
    const stack =
      process.env.NODE_ENV === 'development'
        ? (exception as any).stack
        : undefined;

    response.status(status).json({
      status: statusText,
      message: responseMessage,
      data: null,
      stack,
    });
  }
}
