import { AuthModule } from '@modules/auth/auth.module';
import { OTP, OTPSchema } from '@modules/otp/schema/otp.schema';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoModule } from '@shared/crypto/crypto.module';
import { MailModule } from '@shared/mail/mail.module';

import { User, UsersSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UsersSchema,
      },
      {
        name: OTP.name,
        schema: OTPSchema,
      },
    ]),
    CryptoModule,
    MailModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
