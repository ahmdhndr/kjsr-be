import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '@shared/mail/mail.module';

import { PreapprovedUserRepository } from './preapproved-user.repository';
import { PreapprovedUsersController } from './preapproved-users.controller';
import { PreapprovedUsersService } from './preapproved-users.service';
import {
  PreapprovedUser,
  PreapprovedUserSchema,
} from './schema/preapproved-user.schema';

@Module({
  imports: [
    MailModule,
    JwtModule,
    MongooseModule.forFeature([
      { name: PreapprovedUser.name, schema: PreapprovedUserSchema },
    ]),
  ],
  controllers: [PreapprovedUsersController],
  providers: [PreapprovedUsersService, PreapprovedUserRepository],
  exports: [PreapprovedUsersService],
})
export class PreapprovedUsersModule {}
