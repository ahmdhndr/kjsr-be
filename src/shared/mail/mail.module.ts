import { DEFAULT_EMAIL_FROM } from '@common/constants/global.constant';
import { ConfigModule } from '@config/config.module';
import { OTPModule } from '@modules/otp/otp.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as handlebars from 'handlebars';
import { join } from 'path';

import { MailController } from './mail.controller';
import { MailService } from './mail.service';

const adapter = new HandlebarsAdapter();
handlebars.registerHelper('year', () => new Date().getFullYear());

@Module({
  imports: [
    OTPModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_SMTP_HOST'),
          port: configService.get<number>('EMAIL_SMTP_PORT'),
          secure: configService.get<boolean>('EMAIL_SMTP_SECURE'),
          auth: {
            user: configService.get<string>('EMAIL_SMTP_USER'),
            pass: configService.get<string>('EMAIL_SMTP_PASS'),
          },
        },
        defaults: {
          from: DEFAULT_EMAIL_FROM,
        },
        template: {
          dir: join(__dirname, 'shared/mail/templates'),
          adapter,
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
