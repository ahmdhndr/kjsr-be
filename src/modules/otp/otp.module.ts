import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoModule } from '@shared/crypto/crypto.module';

import { OTPRepository } from './otp.repository';
import { OTPService } from './otp.service';
import { OTP, OTPSchema } from './schema/otp.schema';

@Module({
  imports: [
    CryptoModule,
    MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }]),
    JwtModule,
  ],
  providers: [OTPService, OTPRepository],
  exports: [OTPService],
})
export class OTPModule {}
