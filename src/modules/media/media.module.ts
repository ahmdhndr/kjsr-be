import { Module } from '@nestjs/common';
import { StorageModule } from '@shared/storage/storage.module';

import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [StorageModule],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
