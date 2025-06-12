import { OTPService } from '@modules/otp/otp.service';
import { OTPType } from '@modules/otp/types/otp.type';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { User } from '@modules/users/schema/user.schema';
import { UsersService } from '@modules/users/users.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@shared/mail/mail.service';
import { handleServiceError } from '@utils/handle-service-error';
import { Response } from 'express';
import { Types } from 'mongoose';

import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OTPService,
    private readonly mailService: MailService,
  ) {}

  async register(data: CreateUserDto) {
    return this.usersService.create(data);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async login(user: User, res: Response) {
    try {
      const tokenPayload: TokenPayload = {
        userId: user._id,
      };

      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + 3600);

      const token = this.jwtService.sign(tokenPayload);

      res.cookie('authentication', token, {
        httpOnly: true,
        expires,
      });

      return { user };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async verifyToken(userId: Types.ObjectId, token: string) {
    try {
      await this.otpService.validateOTP(userId, token);

      const user = await this.usersService.findUser({ _id: userId });
      if (!user) {
        throw new NotFoundException('Account not found');
      }

      user.isEmailVerified = true;
      await this.usersService.updateUser({ _id: userId }, user);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async resendOTP(identifier: string) {
    try {
      // find the user with the given identifier
      const user = await this.usersService.findUser({
        $or: [{ email: identifier }, { username: identifier }],
      });

      // send email verification with generated otp
      const otp = await this.mailService.emailVerification(user, OTPType.OTP);
      return { user, otp };
    } catch (error) {
      handleServiceError(error);
    }
  }
}
