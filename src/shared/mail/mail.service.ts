import { VERIFICATION_EMAIL_FROM } from '@common/constants/global.constant';
import { OTPService } from '@modules/otp/otp.service';
import { OTPType } from '@modules/otp/types/otp.type';
import { User } from '@modules/users/schema/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import * as nodemailer from 'nodemailer';

import { SendEmailDto, sendEmailSchema } from './dto/send-email.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly otpService: OTPService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_SMTP_HOST'),
      port: this.configService.get<number>('EMAIL_SMTP_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_SMTP_USER'),
        pass: this.configService.get<string>('EMAIL_SMTP_PASS'),
      },
    });
  }

  async sendEmail(from: string, data: SendEmailDto) {
    const result = sendEmailSchema.safeParse(data);
    if (!result.success) {
      throw new BadRequestException({
        message: extractFirstZodError(result.error.format()),
      });
    }

    const { recipients, subject, html } = result.data;
    const options: nodemailer.SendMailOptions = {
      from,
      to: recipients,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async emailVerification(user: User, otpType: OTPType) {
    const otp = await this.otpService.generateOTP(user, otpType);
    const emailData: SendEmailDto = {
      recipients: [user.email],
      subject: `KJSR verification code: ${otp}`,
      html: `
          <p>Your one-verification code:</p>
          <p style="text-align: center; font-weight: bold">${otp}</p>
          <p>Please use this otp to verify your account. This otp expires after 5 minutes.</p>
        `,
    };
    await this.sendEmail(VERIFICATION_EMAIL_FROM, emailData);
    return otp;
  }
}
