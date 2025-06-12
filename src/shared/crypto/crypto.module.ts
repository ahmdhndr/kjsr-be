import { PASSWORD_HASHER } from '@common/constants/global.constant';
import { Module } from '@nestjs/common';

import { BcryptService } from './bcrypt/bcrypt.service';

@Module({
  providers: [
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptService,
    },
  ],
  exports: [PASSWORD_HASHER],
})
export class CryptoModule {}
