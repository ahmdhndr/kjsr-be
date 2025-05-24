import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { AllExceptionsFilter } from './http-exception.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockResponse: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();

    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson }));
    mockResponse = { status: mockStatus };

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => ({}),
      }),
    } as any;
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'failed',
      message: 'Forbidden',
      data: null,
      stack:
        process.env.NODE_ENV === 'development' ? expect.any(String) : undefined,
    });
  });

  it('should handle unknown exception', () => {
    const exception = new Error('Unexpected error');
    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
      data: null,
      stack:
        process.env.NODE_ENV === 'development' ? expect.any(String) : undefined,
    });
  });

  it('should handle HttpException with object message and status < 500', () => {
    const exception = new HttpException(
      { message: 'Bad Request' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'failed',
      message: 'Bad Request',
      data: null,
      stack:
        process.env.NODE_ENV === 'development' ? expect.any(String) : undefined,
    });
  });

  it('should not include stack if not in development', () => {
    process.env.NODE_ENV = 'production';
    const exception = new Error('Something failed');

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
      data: null,
      stack: undefined,
    });
  });

  it('should include stack if in development', () => {
    process.env.NODE_ENV = 'development';
    const exception = new Error('Something failed');

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
      data: null,
      stack: expect.any(String),
    });
  });
});
