import { z } from 'zod';

export const resetPasswordSchema = z.object({
  token: z
    .string({ message: 'property `token` is missing' })
    .nonempty('token cannot be empty'),
  password: z
    .string({ message: 'property `password` is missing' })
    .nonempty('Password cannot be empty')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
  confirmPassword: z
    .string({ message: 'property `confirmPassword` is missing' })
    .nonempty('Confirm password cannot be empty'),
});

export const refineResetPasswordSchema = resetPasswordSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Password do not match',
    path: ['confirmPassword'],
  },
);

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
