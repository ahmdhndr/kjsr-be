import { z } from 'zod';

import { OTPType } from '../types/otp.type';

export const otpSchema = z.object({
  userId: z.string(),
  token: z.string(),
  type: z.enum([OTPType.OTP, OTPType.RESET_PASSWORD]),
  expiresAt: z.date(),
});

export type OTPDto = z.infer<typeof otpSchema>;
