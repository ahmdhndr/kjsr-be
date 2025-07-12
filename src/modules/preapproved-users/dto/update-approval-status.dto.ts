import { STATUS_PREAPPROVAL } from '@common/constants/global.constant';
import { z } from 'zod';

export const updateApprovalStatusSchema = z.object({
  email: z
    .string({ message: 'property `email` is missing' })
    .email('Must be a valid email'),
  status: z.enum([STATUS_PREAPPROVAL.APPROVED, STATUS_PREAPPROVAL.REJECTED], {
    errorMap: (issue, _ctx) => {
      if (issue.code === 'invalid_type') {
        return { message: 'Property `status` is missing' };
      }
      if (issue.code === 'invalid_enum_value') {
        return {
          message:
            'Invalid status value, must be either `approved` or `rejected`',
        };
      }
      return { message: 'Invalid input' };
    },
  }),
  reason: z.string().optional(),
});

export type UpdateApprovalStatusDTO = z.infer<
  typeof updateApprovalStatusSchema
>;
