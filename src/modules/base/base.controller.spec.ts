import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { BaseController } from './base.controller';
import { BaseService } from './base.service';

describe('BaseController', () => {
  let controller: BaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseController],
      providers: [BaseService],
    }).compile();

    controller = module.get<BaseController>(BaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the success response', () => {
    expect(controller.getHello()).toEqual(
      'Welcome to NestJS starter template 🚀',
    );
  });

  it('should return the greeting message', () => {
    const greetingDto = {
      fullName: 'John',
    };

    expect(controller.greeting(greetingDto)).toEqual('Hello John');
  });

  it('should throw bad request error structure', () => {
    expect(() => controller.getError()).toThrow(BadRequestException);
  });

  it('should throw internal server error correctly', () => {
    expect(() => controller.getInternalError()).toThrow(
      InternalServerErrorException,
    );
  });
});
