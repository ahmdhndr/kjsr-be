import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { R2Service } from '@shared/r2/r2.service';

import { LocalStorageService } from './local-storage.service';
import { StorageDriver } from './storage-driver';

@Module({
  providers: [
    {
      provide: 'STORAGE_DRIVER',
      inject: [ConfigService],
      useFactory: (config: ConfigService): StorageDriver => {
        const driver = config.get<string>('STORAGE_DRIVER');
        if (driver === 'r2') {
          return new R2Service(config);
        } else {
          return new LocalStorageService();
        }
      },
    },
  ],
  exports: ['STORAGE_DRIVER'],
})
export class StorageModule {}
