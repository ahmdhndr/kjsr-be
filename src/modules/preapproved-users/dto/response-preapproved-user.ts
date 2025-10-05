import { PaginationInterface } from '@common/interfaces/pagination/pagination.interface';
import { Expose, Type } from 'class-transformer';

export class ResponsePreapprovedUser {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  status: string;
}

export class ListPreapprovalDto {
  @Expose()
  @Type(() => ResponsePreapprovedUser)
  list: ResponsePreapprovedUser;

  @Expose()
  meta: PaginationInterface;
}
