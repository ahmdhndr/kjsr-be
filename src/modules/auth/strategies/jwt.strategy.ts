import { UsersService } from '@modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Ambil dari header Authorization: Bearer <token>
        ExtractJwt.fromAuthHeaderAsBearerToken(),

        // Ambil dari cookie bernama "authentication"
        (request: Request) => request?.cookies?.authentication as string,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate({ userId }: TokenPayload) {
    return this.usersService.findUser({ _id: userId });
  }
}
