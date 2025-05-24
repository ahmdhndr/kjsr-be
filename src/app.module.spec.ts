import { ConfigModule } from '@config/config.module';
import { BaseModule } from '@modules/base';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './app.module';

describe('AppModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, AppModule, BaseModule],
    }).compile();
  });

  it('should compile the AppModule', () => {
    expect(moduleRef).toBeDefined();
  });
});
