import { Module } from '@nestjs/common';
import { R2Module } from '@shared/r2/r2.module';

import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [R2Module],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
