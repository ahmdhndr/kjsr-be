import { Body, Controller, Post } from '@nestjs/common';

import { SendEmailDto } from './dto/send-email.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post()
  async sendEmail(@Body() data: SendEmailDto) {
    const from = 'Test <achmadhendarsyah@kjsr.or.id>';
    await this.mailService.sendEmail(from, data);
    return {
      status: 'success',
      message: 'Email sent successfully',
      data: null,
    };
  }
}
