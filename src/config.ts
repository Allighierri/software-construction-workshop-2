import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  APP_PRECISION: z.coerce.number().int().min(0).max(10).default(2),
  LOG_LEVEL: z.enum(['silent', 'info', 'debug']).default('info'),
});

export const config = schema.parse(process.env);
export type Config = z.infer<typeof schema>;
