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
      useFactory: (configService: ConfigService) => {
        const secure =
          configService.get<string>('EMAIL_SMTP_SECURE') === 'true';

        return {
          transport: {
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
          },
          defaults: {
            from: DEFAULT_EMAIL_FROM,
            context: {
              clientUrl: configService.get<string>('CLIENT_URL'),
              brandLogo: configService.get<string>('EMAIL_BRAND_LOGO'),
            },
          },
          template: {
            dir: join(__dirname, 'shared/mail/templates'),
            adapter,
            options: {
              strict: true,
              runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
              },
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
