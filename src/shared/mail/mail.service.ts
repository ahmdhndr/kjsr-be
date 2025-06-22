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
    const token = await this.otpService.generateToken(user, otpType);

    if (otpType === OTPType.OTP) {
      const emailData: SendEmailDto = {
        recipients: [user.email],
        subject: `KJSR verification code: ${token}`,
        html: `
            <p>Your one-verification code:</p>
            <p style="text-align: center; font-weight: bold">${token}</p>
            <p>Please use this otp to verify your account. This otp expires after 5 minutes.</p>
          `,
      };
      await this.sendEmail(VERIFICATION_EMAIL_FROM, emailData);
      return token;
    } else if (otpType === OTPType.RESET_PASSWORD) {
      const resetLink = `${this.configService.get<string>('RESET_PASSWORD_URL')}?token=${token}`;

      const emailData: SendEmailDto = {
        recipients: [user.email],
        subject: `[KJSR] reset password request`,
        html: `
            <p>Hello, ${user.username}!</p>
            <p>We received a request to update the password for <strong>${user.username}</strong></p>
            <p>To reset your password, click the link below:</p>
            <a href="${resetLink}" target="_blank" style="background: #007bff; padding: 10px 20px; display: inline-block; border-radius: 4px; font-size: .85rem; margin: 0 auto; color: #fff; text-decoration: none;">Reset Password</a>
            <p>If you did not make this request, your email address may have been entered by mistake and you can safely disregard this email.</p>
            <p>This link valid for 15 minutes.</p>
          `,
      };
      await this.sendEmail(VERIFICATION_EMAIL_FROM, emailData);
      return token;
    }
  }
}
