import { OTPService } from '@modules/otp/otp.service';
import { OTPType } from '@modules/otp/types/otp.type';
import { User } from '@modules/users/schema/user.schema';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

import { SendEmailDtoNodemailer, sendEmailSchema } from './dto/send-email.dto';

@Injectable()
export class MailService {
  private transporter: Transporter;
  constructor(
    private readonly configService: ConfigService,
    private readonly otpService: OTPService,
  ) {
    const secure = configService.get<string>('EMAIL_SMTP_SECURE') === 'true';
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('EMAIL_SMTP_HOST'),
      port: configService.get<number>('EMAIL_SMTP_PORT'),
      secure,
      auth: {
        user: configService.get<string>('EMAIL_SMTP_USER'),
        pass: configService.get<string>('EMAIL_SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: false, // menghindari SSL validation render
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async sendEmail(data: SendEmailDtoNodemailer) {
    try {
      const result = sendEmailSchema.safeParse(data);
      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const emailFrom = this.configService.get<string>('DEFAULT_EMAIL_FROM')!;

      const {
        from = emailFrom,
        recipients,
        subject,
        template,
        context = {},
      } = data;

      const mergedContext = {
        ...context,
        clientUrl: this.configService.get<string>('CLIENT_URL'),
        brandLogo: this.configService.get<string>('EMAIL_BRAND_LOGO'),
      };
      const options: ISendMailOptions = {
        from,
        to: recipients,
        subject,
        template,
        context: mergedContext,
      };
      this.transporter
        .sendMail({
          ...options,
          from: this.configService.get<string>('DEFAULT_EMAIL_FROM'),
        })
        .catch((err) => console.error(err));
    } catch (error) {
      handleServiceError(error);
    }
  }

  async emailVerification(user: User, otpType: OTPType) {
    try {
      const token = await this.otpService.generateToken(user, otpType);

      if (otpType === OTPType.OTP) {
        const emailData: SendEmailDtoNodemailer = {
          recipients: [user.email],
          subject: `KJSR verification code: ${token}`,
          template: 'registration-success',
          context: {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            otp: token,
          },
        };
        await this.sendEmail(emailData);
        return token;
      } else if (otpType === OTPType.RESET_PASSWORD) {
        const resetLink = `${this.configService.get<string>('CLIENT_URL')}/reset-password?token=${token}`;

        const emailData: SendEmailDtoNodemailer = {
          recipients: [user.email],
          subject: '[KJSR] reset password request',
          template: 'reset-password',
          context: {
            resetLink,
            username: user.username,
          },
        };
        await this.sendEmail(emailData);
        return token;
      }
    } catch (error) {
      handleServiceError(error);
    }
  }
}
