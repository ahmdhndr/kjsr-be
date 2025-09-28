import {
  ADMIN_RECIPIENT,
  STATUS_PREAPPROVAL,
} from '@common/constants/global.constant';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@shared/mail/mail.service';
import { extractFirstZodError } from '@utils/extract-first-zod-error';
import { handleServiceError } from '@utils/handle-service-error';
import { FilterQuery } from 'mongoose';

import {
  PreapprovedUserDTO,
  preapprovedUserSchema,
} from './dto/create-preapproved-user.dto';
import {
  UpdateApprovalStatusDTO,
  updateApprovalStatusSchema,
} from './dto/update-approval-status.dto';
import { PreapprovedUserRepository } from './preapproved-user.repository';
import { PreapprovedUser } from './schema/preapproved-user.schema';

@Injectable()
export class PreapprovedUsersService {
  constructor(
    private readonly preapprovedUserRepository: PreapprovedUserRepository,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async checkEmailExist(data: PreapprovedUserDTO) {
    try {
      const result = preapprovedUserSchema.safeParse(data);

      if (!result.success) {
        throw new BadRequestException({
          message: extractFirstZodError(result.error.format()),
        });
      }
      const isEmailExist = await this.preapprovedUserRepository.findOne({
        email: data.email,
      });
      if (isEmailExist) {
        throw new UnprocessableEntityException(
          `This email has already been submitted. Current approval status: ${isEmailExist.status}`,
        );
      }
    } catch (error) {
      handleServiceError(error);
    }
  }

  async requestPreapprovedUser(
    preapprovedUser: PreapprovedUserDTO,
  ): Promise<PreapprovedUser> {
    try {
      await this.checkEmailExist(preapprovedUser);
      const result =
        await this.preapprovedUserRepository.create(preapprovedUser);

      const adminRecipients = [
        ADMIN_RECIPIENT,
        'achmadhendarsyah7@gmail.com',
      ] as [string, ...string[]];

      // send notif to admin
      await this.mailService.sendEmail({
        recipients: adminRecipients,
        subject: `[Notifikasi KJSR] Pengajuan Pendaftaran Anggota Baru dari ${preapprovedUser.email}`,
        template: 'request-preapproved-user',
        context: {
          email: preapprovedUser.email,
        },
      });
      return result;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateApprovalStatus(
    query: FilterQuery<PreapprovedUser>,
    payload: UpdateApprovalStatusDTO,
  ) {
    try {
      const validatePayload = updateApprovalStatusSchema.safeParse(payload);
      if (!validatePayload.success) {
        throw new BadRequestException({
          message: extractFirstZodError(validatePayload.error.format()),
        });
      }

      const { email, status, reason } = payload;

      const preapproval = await this.preapprovedUserRepository.findOne({
        email,
      });

      if (!preapproval) {
        throw new BadRequestException('Email not found');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (preapproval.status !== STATUS_PREAPPROVAL.PENDING) {
        throw new BadRequestException(
          `This email has already been processed with status: ${preapproval.status}`,
        );
      }

      if (status === STATUS_PREAPPROVAL.APPROVED) {
        const registerToken = this.jwtService.sign(
          {
            id: preapproval._id,
            email,
          },
          {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '3d',
          },
        );

        const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 hari

        preapproval.registerToken = registerToken;
        preapproval.status = status;
        preapproval.expiresAt = expiresAt;
        preapproval.reason = reason || 'Approved by admin';
        await this.preapprovedUserRepository.findOneAndUpdate(
          query,
          preapproval,
        );

        // const registerUrl = `${this.configService.get<string>('CLIENT_URL')}/register?email=${email}&token=${registerToken}`;

        // send notif to user
        await this.mailService.sendEmail({
          recipients: [email],
          subject: `[Notifikasi KJSR] Status Pengajuan Pendaftaran Anggota KJSR`,
          template: 'preapproved-approved',
          context: {
            email,
            registerToken,
          },
        });
      } else if (status === STATUS_PREAPPROVAL.REJECTED) {
        if (!reason) {
          throw new BadRequestException('Reason is required when rejecting');
        }

        await this.preapprovedUserRepository.findOneAndUpdate(
          {
            email,
          },
          {
            status,
            reason,
          },
        );

        // send notif to user
        await this.mailService.sendEmail({
          recipients: [email],
          subject: `[Notifikasi KJSR] Status Pengajuan Pendaftaran Anggota KJSR`,
          template: 'preapproved-rejected',
          context: {
            email,
            reason,
          },
        });
      } else {
        throw new BadRequestException('Invalid status');
      }
    } catch (error) {
      handleServiceError(error);
    }

    return null;
  }

  async findOneBy(
    filterQuery: FilterQuery<PreapprovedUser>,
  ): Promise<PreapprovedUser | null> {
    try {
      return this.preapprovedUserRepository.findOne(filterQuery);
    } catch (error) {
      handleServiceError(error);
    }
  }
}
