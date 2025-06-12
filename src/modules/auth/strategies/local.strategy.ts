import { UsersService } from '@modules/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import { Request } from 'express';
import { Strategy } from 'passport-local';

import { loginSchema } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({ usernameField: 'identifier', passReqToCallback: true });
  }

  async validate(req: Request, identifier: string, password: string) {
    try {
      const result = loginSchema.safeParse({ identifier, password });
      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }

      const otp: string = (
        req.body as { identifier: string; password: string; otp: string }
      ).otp;
      return this.userService.validateUser({ identifier, password, otp });
    } catch (error) {
      handleServiceError(error);
    }
  }
}
