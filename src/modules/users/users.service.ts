import { PASSWORD_HASHER } from '@common/constants/global.constant';
import { PasswordHasher } from '@common/interfaces/password-hasher';
import { AuthService } from '@modules/auth/auth.service';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { OTPType } from '@modules/otp/types/otp.type';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { MailService } from '@shared/mail/mail.service';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import { FilterQuery } from 'mongoose';

import { CreateUserDto, refineCreateUserSchema } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasher,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  private async validateCreateUserDto(data: CreateUserDto) {
    try {
      const result = await this.usersRepository.findOne({
        $or: [{ email: data.email }, { username: data.username }],
      });
      if (result) {
        throw new UnprocessableEntityException('User already exists');
      }
    } catch (error) {
      handleServiceError(error);
    }
  }

  async create(data: CreateUserDto) {
    try {
      await this.validateCreateUserDto(data);
      const result = refineCreateUserSchema.safeParse(data);

      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const hashPassword = await this.hasher.hash(data.password);
      const newUser = await this.usersRepository.create({
        ...data,
        password: hashPassword,
      });

      // send email verification with generated otp
      await this.mailService.emailVerification(newUser, OTPType.OTP);
      return newUser;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async validateUser(loginDto: LoginDto) {
    try {
      const { identifier, password, otp } = loginDto;

      // check user exist
      const user = await this.usersRepository.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // check password
      const isPasswordMatched = await this.hasher.compare(
        password,
        user.password,
      );

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      // Check account status
      if (!user.isEmailVerified) {
        if (!otp) {
          throw new UnauthorizedException(
            'Your account is not verified. Please provide your otp to verify.',
          );
        } else {
          await this.authService.verifyToken(user._id, otp);
        }
      }

      return user;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async findUser(findUserDto: FilterQuery<User>) {
    try {
      const user = await this.usersRepository.findOne(findUserDto);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateUser(
    updateUserDto: FilterQuery<User>,
    updateUser: Partial<User>,
  ) {
    try {
      const user = await this.findUser(updateUserDto);
      const updatedUser = await this.usersRepository.findOneAndUpdate(
        user,
        updateUser,
      );
      return updatedUser;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async isEmailRegistered(findUserDto: FilterQuery<User>) {
    try {
      const user = await this.usersRepository.findOne(findUserDto);

      return user;
    } catch (error) {
      handleServiceError(error);
    }
  }
}
