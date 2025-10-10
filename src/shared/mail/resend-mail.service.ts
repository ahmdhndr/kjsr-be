import { DEFAULT_EMAIL_FROM } from '@common/constants/global.constant';
import { Mailer } from '@common/interfaces/mailer';
import { OTPService } from '@modules/otp/otp.service';
import { OTPType } from '@modules/otp/types/otp.type';
import { User } from '@modules/users/schema/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';
import { CreateEmailOptions, Resend } from 'resend';

import { SendEmailDto, sendEmailSchema } from './dto/send-email.dto';

@Injectable()
export class ResendMailService implements Mailer {
  private resend: Resend;

  constructor(
    private configService: ConfigService,
    private readonly otpService: OTPService,
  ) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));

    handlebars.registerHelper('year', () => new Date().getFullYear());
  }

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
      const finalHtml = template
        ? this.renderTemplate(template, context || {})
        : '<p>No content</p>';

      const options: CreateEmailOptions = {
        from,
        to: recipients,
        subject,
        html: finalHtml,
        // context: mergedContext,
      };
      await this.resend.emails.send(options);
    } catch (error) {
      console.error('sendemail\n', error);
      handleServiceError(error);
    }
  }

  private renderTemplate(templateName: string, context: Record<string, any>) {
    const templatePath = path.join(
      __dirname,
      'shared/mail/templates',
      `${templateName}.hbs`,
    );
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    return compiledTemplate({
      ...context,
      clientUrl: this.configService.get<string>('CLIENT_URL'),
      brandLogo: this.configService.get<string>('EMAIL_BRAND_LOGO'),
    });
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
            username: user.username,
          },
        };
        await this.sendEmail(emailData);
        return token;
      }
    } catch (error) {
      console.error(error);
      handleServiceError(error);
    }
  }
}
