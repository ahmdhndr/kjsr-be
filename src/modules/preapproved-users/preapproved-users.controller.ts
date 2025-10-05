import { SuccessResponseMessage } from '@common/decorators';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { Serialize } from '@common/interceptors';
import { QueryPaginationInterface } from '@common/interfaces/pagination/pagination.interface';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PreapprovedUserDTO } from './dto/create-preapproved-user.dto';
import {
  ListPreapprovalDto,
  ResponsePreapprovedUser,
} from './dto/response-preapproved-user';
import { UpdateApprovalStatusDTO } from './dto/update-approval-status.dto';
import { PreapprovedUsersService } from './preapproved-users.service';

@Controller('preapproval')
export class PreapprovedUsersController {
  constructor(
    private readonly preapprovedUsersService: PreapprovedUsersService,
  ) {}

  @Post('/request')
  @Serialize(ResponsePreapprovedUser)
  @SuccessResponseMessage('Approval submitted successfully')
  async request(@Body() data: PreapprovedUserDTO) {
    return this.preapprovedUsersService.requestPreapprovedUser(data);
  }

  @Patch('/approval')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serialize(ResponsePreapprovedUser)
  @SuccessResponseMessage('Approval updated')
  async updateApprovalStatus(@Body() payload: UpdateApprovalStatusDTO) {
    return this.preapprovedUsersService.updateApprovalStatus(
      { email: payload.email },
      payload,
    );
  }

  @Get('/lists')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serialize(ListPreapprovalDto)
  async listApprovalUser(@Query() queries: QueryPaginationInterface) {
    return this.preapprovedUsersService.listApprovalUser(queries);
  }
}
