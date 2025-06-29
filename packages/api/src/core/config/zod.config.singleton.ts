import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { EnvVariables, validateEnv } from './env/validate.env';
import { ZodService } from './zod.service';

// 1.Load env.
dotenv.config();

//2. Validate
const parseEnv = validateEnv(process.env);

//3. create fully typed services
const configService = new ConfigService<EnvVariables>(parseEnv);
const zodConfigService = new ZodService(configService);

// export singleton
export const zodConfig: ZodService = zodConfigService;
