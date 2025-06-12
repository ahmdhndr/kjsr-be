import { AbstractRepository } from '@common/abstracts/mongo/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OTP } from './schema/otp.schema';

@Injectable()
export class OTPRepository extends AbstractRepository<OTP> {
  protected readonly logger = new Logger(OTPRepository.name);

  constructor(
    @InjectModel(OTP.name)
    userModel: Model<OTP>,
  ) {
    super(userModel);
  }
}
