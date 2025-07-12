import { STATUS_PREAPPROVAL } from '@common/constants/global.constant';
import { z } from 'zod';

export const preapprovedUserSchema = z.object({
  email: z
    .string({ message: 'property `email` is missing' })
    .nonempty('Email cannot be empty')
    .email('Email must be valid'),
  status: z
    .enum([
      STATUS_PREAPPROVAL.PENDING,
      STATUS_PREAPPROVAL.APPROVED,
      STATUS_PREAPPROVAL.REJECTED,
    ])
    .default(STATUS_PREAPPROVAL.PENDING),
  registerToken: z.string().nullable().default(null),
  reason: z.string().nullable().default(null),
  expiresAt: z.date().nullable().default(null),
});

export type PreapprovedUserDTO = z.infer<typeof preapprovedUserSchema>;
