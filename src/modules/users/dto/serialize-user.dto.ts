import { Expose } from 'class-transformer';

export class SerializeUserDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  avatar: string;

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
