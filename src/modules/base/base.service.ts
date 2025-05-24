import { BadRequestException, Injectable } from '@nestjs/common';

import { GreetingDto } from './dto/greeting.dto';

@Injectable()
export class BaseService {
  getHello() {
    return 'Welcome to NestJS starter template 🚀';
  }

  greeting(greetingDto: GreetingDto) {
    return `Hello ${greetingDto.fullName}`;
  }

  getError() {
    throw new BadRequestException('This is a bad request error');
  }
}
