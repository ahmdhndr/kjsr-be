import { DEFAULT_EMAIL_FROM } from '@common/constants/global.constant';
import { OTPService } from '@modules/otp/otp.service';
import { OTPType } from '@modules/otp/types/otp.type';
import { User } from '@modules/users/schema/user.schema';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import { join } from 'path';

import { SendEmailDto, sendEmailSchema } from './dto/send-email.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly otpService: OTPService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(data: SendEmailDto) {
    try {
      const result = sendEmailSchema.safeParse(data);
      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const {
        from = DEFAULT_EMAIL_FROM,
        recipients,
        subject,
        template,
        context = {},
      } = data;
      const options: ISendMailOptions = {
        from,
        to: recipients,
        subject,
        template,
        context,
        attachments: [
          {
            filename: 'logo-kjsr.png',
            path: join(__dirname, '..', '/public/logo-kjsr.png'),
            cid: 'kjsr-logo',
          },
        ],
      };
      await this.mailerService.sendMail(options);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async emailVerification(user: User, otpType: OTPType) {
    try {
      const token = await this.otpService.generateToken(user, otpType);

      if (otpType === OTPType.OTP) {
        const emailData: SendEmailDto = {
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

        const emailData: SendEmailDto = {
          recipients: [user.email],
          subject: '[KJSR] reset password request',
          template: 'reset-password',
          context: {
            resetLink,
            user,
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
