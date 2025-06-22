import { Expose, Type } from 'class-transformer';

import { SerializeUserDto } from './serialize-user.dto';

export class RegisterResponseDto {
  @Expose()
  @Type(() => SerializeUserDto)
  user: SerializeUserDto;

  @Expose()
  otp: string;

  @Expose()
  token: string;
}
