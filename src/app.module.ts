import { LoggerModule } from '@common/logger';
import { ConfigModule } from '@config/config.module';
import { BaseModule } from '@modules/base';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule, LoggerModule, BaseModule],
})
export class AppModule {}
