import { Body, Controller, Post } from '@nestjs/common';

import { SendEmailDto } from './dto/send-email.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('inbox')
  async sendEmail(@Body() data: SendEmailDto) {
    return this.mailService.sendEmail(data);
  }
}
