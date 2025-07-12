import { MongoDatabaseModule } from '@common/databases/mongo/mongo-database.module';
import { LoggerModule } from '@common/logger';
import { ConfigModule } from '@config/config.module';
import { AuthModule } from '@modules/auth/auth.module';
import { OTPModule } from '@modules/otp/otp.module';
import { PreapprovedUsersModule } from '@modules/preapproved-users/preapproved-users.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { MailModule } from '@shared/mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongoDatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    OTPModule,
    PreapprovedUsersModule,
  ],
})
export class AppModule {}
