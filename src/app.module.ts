import { MongoDatabaseModule } from '@common/databases/mongo/mongo-database.module';
import { LoggerModule } from '@common/logger';
import { ConfigModule } from '@config/config.module';
import { AuthModule } from '@modules/auth/auth.module';
import { BaseModule } from '@modules/base';
import { OTPModule } from '@modules/otp/otp.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { MailModule } from '@shared/mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongoDatabaseModule,
    BaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    OTPModule,
  ],
})
export class AppModule {}
