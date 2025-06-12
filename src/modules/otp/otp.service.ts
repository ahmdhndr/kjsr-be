import { PASSWORD_HASHER } from '@common/constants/global.constant';
import { PasswordHasher } from '@common/interfaces/password-hasher';
import { User } from '@modules/users/schema/user.schema';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { handleServiceError } from '@utils/handle-service-error';
import { randomInt } from 'crypto';
import { FilterQuery, Types } from 'mongoose';

import { OTPRepository } from './otp.repository';
import { OTP } from './schema/otp.schema';
import { OTPType } from './types/otp.type';

@Injectable()
export class OTPService {
  constructor(
    private readonly otpRepository: OTPRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async generateOTP(user: User, type: OTPType): Promise<string> {
    try {
      // generate 6 digit otp
      const otp = randomInt(100000, 999999).toString();
      const hashedOtp = await this.passwordHasher.hash(otp);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

      // Check otp with the given user
      const existingOTP = await this.findOTPByUserId({
        userId: user._id,
        type,
      });

      if (existingOTP) {
        // update existing otp
        existingOTP.token = hashedOtp;
        existingOTP.expiresAt = expiresAt;
        await this.updateOTPByUserId({ userId: user._id }, existingOTP);
      } else {
        // create new otp
        await this.otpRepository.create({
          userId: user._id,
          token: hashedOtp,
          type,
          expiresAt,
        });
      }

      return otp;
    } catch (error) {
      console.log(error);
      handleServiceError(error);
    }
  }

  async validateOTP(userId: Types.ObjectId, token: string): Promise<boolean> {
    try {
      const validToken = await this.otpRepository.findOne({
        userId,
        expiresAt: { $gt: new Date() },
      });

      if (!validToken) {
        throw new UnauthorizedException(
          'Wrong or expired OTP. Please, request a new one.',
        );
      }

      const isMatch = await this.passwordHasher.compare(
        token,
        validToken.token,
      );
      if (!isMatch) {
        throw new UnauthorizedException('Invalid OTP. Please try again.');
      }

      return true;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async findOTPByUserId(filterQuery: FilterQuery<OTP>) {
    return this.otpRepository.findOne(filterQuery);
  }

  async updateOTPByUserId(
    filterQuery: FilterQuery<OTP>,
    update: Partial<OTP>,
  ): Promise<OTP | null> {
    return this.otpRepository.findOneAndUpdate(filterQuery, update);
  }
}
