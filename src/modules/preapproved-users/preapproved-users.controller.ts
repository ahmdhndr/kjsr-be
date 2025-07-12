import { SuccessResponseMessage } from '@common/decorators';
import { Serialize } from '@common/interceptors';
import { Body, Controller, Patch, Post } from '@nestjs/common';

import { PreapprovedUserDTO } from './dto/create-preapproved-user.dto';
import { ResponsePreapprovedUser } from './dto/response-preapproved-user';
import { UpdateApprovalStatusDTO } from './dto/update-approval-status.dto';
import { PreapprovedUsersService } from './preapproved-users.service';

@Controller('preapproval')
@Serialize(ResponsePreapprovedUser)
export class PreapprovedUsersController {
  constructor(
    private readonly preapprovedUsersService: PreapprovedUsersService,
  ) {}

  @Post('/request')
  @SuccessResponseMessage('User request submitted successfully')
  async request(@Body() data: PreapprovedUserDTO) {
    return this.preapprovedUsersService.requestPreapprovedUser(data);
  }

  @Patch('/approval')
  @SuccessResponseMessage('Approval updated')
  async updateApprovalStatus(@Body() payload: UpdateApprovalStatusDTO) {
    return this.preapprovedUsersService.updateApprovalStatus(
      { email: payload.email },
      payload,
    );
  }
}
