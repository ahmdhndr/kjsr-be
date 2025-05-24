import { Expose } from 'class-transformer';

export class ResponseDto {
  @Expose()
  data: string;
}
