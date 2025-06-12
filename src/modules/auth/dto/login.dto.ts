import { emailRegex } from '@utils/email-regex';
import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string({ message: 'property `identifier` is missing' })
    .nonempty('Please fill in your username or email')
    .refine(
      (val) => {
        const isEmail = emailRegex.test(val);
        const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(val);
        return isEmail || isUsername;
      },
      {
        message: 'Identifier must be a valid username or email',
      },
    ),
  password: z
    .string({ message: 'property `password` is missing' })
    .nonempty('Please fill in your password'),
  otp: z.string().optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
