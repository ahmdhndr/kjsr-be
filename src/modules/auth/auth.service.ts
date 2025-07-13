/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PASSWORD_HASHER } from '@common/constants/global.constant';
import { PasswordHasher } from '@common/interfaces/password-hasher';
import { OTPService } from '@modules/otp/otp.service';
import { OTPType } from '@modules/otp/types/otp.type';
import { PreapprovedUsersService } from '@modules/preapproved-users/preapproved-users.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { User } from '@modules/users/schema/user.schema';
import { UsersService } from '@modules/users/users.service';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@shared/mail/mail.service';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import { Response } from 'express';
import { Types } from 'mongoose';

import {
  ResetPasswordDto,
  refineResetPasswordSchema,
} from './dto/reset-password.dto';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OTPService,
    private readonly mailService: MailService,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    private readonly preapprovedUsersService: PreapprovedUsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: CreateUserDto) {
    try {
      const preapproval = await this.preapprovedUsersService.findOneBy({
        email: data.email,
      });
      if (!preapproval) {
        throw new ForbiddenException(
          'Email has not been submitted for registration',
        );
      }

      const now = new Date();
      if (preapproval.expiresAt && now > preapproval.expiresAt) {
        throw new ForbiddenException(
          'Registration token has expired. Please request a new approval.',
        );
      }

      const createdUser = await this.usersService.create(data);
      return { user: createdUser };
    } catch (error) {
      handleServiceError(error);
    }
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
        secure: process.env.NODE_ENV === 'production',
        expires,
      });

      return { token };
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

  async forgotPassword(identifier: string) {
    try {
      // find the user with the given identifier
      const user = await this.usersService.findUser({
        $or: [{ email: identifier }, { username: identifier }],
      });

      // send email verification with generated otp
      await this.mailService.emailVerification(user, OTPType.RESET_PASSWORD);
      return null;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<null> {
    try {
      const result = refineResetPasswordSchema.safeParse(data);
      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const userId = await this.otpService.validateToken(data.token);

      const user = await this.usersService.findUser({ _id: userId });

      user.password = await this.passwordHasher.hash(result.data.password);

      await this.usersService.updateUser({ _id: userId }, user);
      return null;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async verifyUser({ email, otp }: { email: string; otp: string }) {
    try {
      const user = await this.usersService.findUser({ email });

      await this.verifyToken(user._id, otp);
      return null;
    } catch (error) {
      handleServiceError(error);
    }
  }
}
