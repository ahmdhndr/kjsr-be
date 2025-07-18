import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string(),
  EMAIL_SMTP_HOST: z.string(),
  EMAIL_SMTP_USER: z.string(),
  EMAIL_SMTP_PASS: z.string(),
  EMAIL_SMTP_PORT: z.coerce.number(),
  EMAIL_SMTP_SECURE: z.coerce.boolean(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  JWT_SECRET_PASSWORD_RESET: z.string(),
  CLIENT_URL: z.string(),
});
