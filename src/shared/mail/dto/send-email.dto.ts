import { z } from 'zod';

export const sendEmailSchema = z.object({
  recipients: z
    .array(z.string().email())
    .nonempty('Recipients cannot be empty'),
  subject: z
    .string({ message: 'property `subject` is missing' })
    .nonempty('Subject cannot be empty'),
  html: z.string({ message: 'property `html` is missing' }),
  text: z.string().optional(),
});

export type SendEmailDto = z.infer<typeof sendEmailSchema>;
