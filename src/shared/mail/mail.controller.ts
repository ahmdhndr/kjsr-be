import { MAILER } from '@common/constants/global.constant';
import { Mailer } from '@common/interfaces/mailer';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { SendEmailDto } from './dto/send-email.dto';

@Controller('mail')
export class MailController {
  constructor(@Inject(MAILER) private readonly mailService: Mailer) {}
  @Post('inbox')
  async sendEmail(@Body() data: SendEmailDto) {
    return this.mailService.sendEmail(data);
  }
}
