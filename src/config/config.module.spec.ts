import { Test } from '@nestjs/testing';

import { envSchema } from './env.schema';

describe('ConfigModule success validation', () => {
  it('should pass validation with valid env', () => {
    const validEnv = {
      NODE_ENV: 'development',
      PORT: '3000',
    };

    expect(() => envSchema.safeParse(validEnv)).not.toThrow();
  });
});

let exitSpy: jest.SpyInstance;
let consoleErrorSpy: jest.SpyInstance;
describe('ConfigModule failed validation', () => {
  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit was called');
    });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should fail validation with invalid env', async () => {
    process.env.NODE_ENV = 'invalid'; // assumed invalid by schema
    process.env.PORT = '3000';

    await expect(
      Test.createTestingModule({
        imports: [require('./config.module').ConfigModule],
      }).compile(),
    ).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ Invalid environment variables:',
      expect.any(Object),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
