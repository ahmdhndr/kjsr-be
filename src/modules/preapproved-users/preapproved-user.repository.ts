import { AbstractRepository } from '@common/abstracts/mongo/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PreapprovedUser } from './schema/preapproved-user.schema';

@Injectable()
export class PreapprovedUserRepository extends AbstractRepository<PreapprovedUser> {
  protected readonly logger = new Logger(PreapprovedUserRepository.name);

  constructor(
    @InjectModel(PreapprovedUser.name)
    userModel: Model<PreapprovedUser>,
  ) {
    super(userModel);
  }
}
