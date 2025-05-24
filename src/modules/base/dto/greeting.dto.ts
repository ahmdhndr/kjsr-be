import { z } from 'zod';

export const greetingSchema = z.object({
  fullName: z
    .string({ message: 'Missing property fullName' })
    .nonempty('Full Name is required'),
});

export type GreetingDto = z.infer<typeof greetingSchema>;
