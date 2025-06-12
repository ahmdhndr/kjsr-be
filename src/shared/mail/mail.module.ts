import { OTPModule } from '@modules/otp/otp.module';
import { Module } from '@nestjs/common';

import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [OTPModule],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
