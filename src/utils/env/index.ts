/* istanbul ignore file */
import { envSchema } from '@config/env.schema';

export const env = envSchema.parse(process.env);
