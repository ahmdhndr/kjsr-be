import { SuccessResponseMessage } from '@common/decorators';
import { CurrentUser } from '@common/decorators/current-user';
import { Serialize } from '@common/interceptors';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { RegisterResponseDto } from '@modules/users/dto/register-response.dto';
// import { SerializeUserDto } from '@modules/users/dto/serialize-user.dto';
import { User } from '@modules/users/schema/user.schema';
// import { RegisterResponseDto } from '@modules/users/dto/register-response.dto';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@Serialize(RegisterResponseDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @SuccessResponseMessage(
    'Account created successfully. Please check your email to verify your account!',
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        username: { type: 'string', example: 'johndoe' },
        email: { type: 'string', example: 'johndoe@example.com' },
        password: { type: 'string', example: '<yourpassword>' },
        confirmPassword: { type: 'string', example: '<yourpassword>' },
      },
    },
  })
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
          example: 'johndoe@example.com / johndoe',
        },
        password: { type: 'string', example: '<yourpassword>' },
      },
    },
  })
  login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Post('resend-otp')
  @HttpCode(200)
  @SuccessResponseMessage(
    'OTP sent successfully. Please check your email to verify your account!',
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
          example: 'johndoe@example.com / johndoe',
        },
      },
    },
  })
  async resendOTP(@Body() data: { identifier: string }) {
    return this.authService.resendOTP(data.identifier);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @SuccessResponseMessage(
    'Password reset link sent successfully. Please check your email to reset your password',
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
          example: 'johndoe@example.com / johndoe',
        },
      },
    },
  })
  async forgotPassword(@Body() data: { identifier: string }) {
    return this.authService.forgotPassword(data.identifier);
  }

  @Post('reset-password')
  @HttpCode(200)
  @SuccessResponseMessage(
    'Password successfully reset. Please log in with your new password',
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: '<yourtoken>' },
        password: {
          type: 'string',
          example: '<newpassword>',
        },
        confirmPassword: {
          type: 'string',
          example: '<newpassword>',
        },
      },
    },
  })
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Post('verify-user')
  @HttpCode(200)
  @SuccessResponseMessage('Account verified successfully')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'johndoe@example.com',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Verify user with the given email' })
  verifyUser(@Body() data: { email: string; otp: string }) {
    return this.authService.verifyUser(data);
  }
}
