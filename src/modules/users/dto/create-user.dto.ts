import { ROLES } from '@common/constants/global.constant';
import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z
    .string({ message: 'property `firstName` is missing' })
    .nonempty('First name cannot be empty'),
  lastName: z
    .string({ message: 'property `lastName` is missing' })
    .nonempty('Last name cannot be empty'),
  username: z
    .string({ message: 'property `username` is missing' })
    .nonempty('Username cannot be empty'),
  email: z
    .string({ message: 'property `email` is missing' })
    .nonempty('Email cannot be empty')
    .email('Email must be valid'),
  role: z.enum([ROLES.ADMIN, ROLES.MEMBER]).default(ROLES.MEMBER),
  avatar: z
    .string({ message: 'property `avatar` is missing' })
    .nullable()
    .default(null),
  isActive: z.boolean().default(false),
  isEmailVerified: z.boolean().default(false),
  activationCode: z.string().nullable().default(null),
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
  token: z
    .string({ message: 'property `token` is missing' })
    .nonempty('Register token cannot be empty'),
});

export const refineCreateUserSchema = createUserSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Password do not match',
    path: ['confirmPassword'],
  },
);

export type CreateUserDto = z.infer<typeof createUserSchema>;
