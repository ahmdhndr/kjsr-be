import { z } from 'zod';

export const sendEmailSchema = z.object({
  from: z.string({ message: 'property `from` is missing' }).optional(),
  recipients: z
    .array(z.string().email())
    .nonempty('Recipients cannot be empty'),
  subject: z
    .string({ message: 'property `subject` is missing' })
    .nonempty('Subject cannot be empty'),
  template: z.string({ message: 'property `template` is missing' }),
  context: z.record(z.any()).optional(),
});

export type SendEmailDto = z.infer<typeof sendEmailSchema>;
