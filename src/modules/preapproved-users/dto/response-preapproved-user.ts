import { Expose } from 'class-transformer';

export class ResponsePreapprovedUser {
  @Expose()
  email: string;
}
