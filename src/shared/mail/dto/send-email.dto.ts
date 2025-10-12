import { ReactElement } from 'react';
import { z } from 'zod';

export const sendEmailSchema = z.object({
  from: z.string({ message: 'property `from` is missing' }).optional(),
  recipients: z
    .array(z.string().email())
    .nonempty('Recipients cannot be empty'),
  subject: z
    .string({ message: 'property `subject` is missing' })
    .nonempty('Subject cannot be empty'),
  template: z.union([
    z.string({ message: 'property `template` is missing' }),
    z.custom<ReactElement>(
      (val) => val !== null && typeof val === 'object' && '$$typeof' in val, // cara deteksi React element
      {
        message: 'Invalid React element for template',
      },
    ),
  ]),
  context: z.record(z.any()).optional(),
});

export type SendEmailDto = z.infer<typeof sendEmailSchema>;
export type SendEmailDtoNodemailer = SendEmailDto & {
  template: string;
};
