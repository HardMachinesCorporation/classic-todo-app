import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { inspect } from 'util';
import { z } from 'zod';

dotenv.config({ encoding: 'utf-8', path: '.env' });

export type NodeEnvironment = 'development' | 'production';

// 🛠️ Errors Formater
const customErrorMap: z.ZodErrorMap = (issue, _ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.received === 'undefined') {
      return {
        message: `The environment variable ${issue.path[0]} is not provided`,
      };
    }
    return {
      message: `Its not a valid type ${issue.expected} for ${issue.path[0]} got ${issue.received}`,
    };
  }
  return { message: _ctx.defaultError };
};

z.setErrorMap(customErrorMap);

// Schema validation

const DatabaseConfigSchema = z.object({
  DATABASE_URL: z
    .string()
    .trim()
    .url()
    .regex(/^postgresql:\/\//, 'Must begin with postgresql://')
    .describe('Database URL'),
});

const ServerSettingsSchema = z.object({
  APP_PORT: z.coerce
    .number()
    .int()
    .positive()
    .max(65535)
    .describe('Server port'),
  API_PREFIX: z
    .string()
    .trim()
    .startsWith('/')
    .default('/api')
    .describe('API prefix'),
  NODE_ENV: z.enum(['development', 'production']).describe('Node environment'),
  FRONTEND_URL: z.string().trim().url().describe('Frontend URL'),
});

// 🧩 Fusion
const GlobalConfigShema = DatabaseConfigSchema.merge(
  ServerSettingsSchema
).describe('Global configuration');

export type EnvVariables = z.infer<typeof GlobalConfigShema>;

/**
 * Validates the given environment variables using the `GlobalConfigShema`.
 *
 * This function:
 * - Converts necessary values (e.g., `APP_PORT` to number).
 * - Uses `zod`'s `safeParse` to validate the structure.
 * - Logs errors in a readable format if validation fails.
 * - Exits the process if validation is unsuccessful.
 * - Logs the parsed config if `NODE_ENV` is `'development'`.
 *
 * @param env - A plain object representing environment variables (e.g., from `process.env`).
 * @returns The validated and typed environment configuration.
 *
 * @throws This function does not throw but will **terminate the process** if validation fails.
 *
 * @example
 * const config = validateEnv(process.env);
 * console.log(config.APP_PORT); // Safe access to typed variables
 */
export function validateEnv(env: Record<string, unknown>): EnvVariables {
  const envLogging = new Logger('Environment');
  const processedConfig = {
    ...env,
    APP_PORT: Number(env.APP_PORT),
  };

  const result = GlobalConfigShema.safeParse(processedConfig);

  if (!result.success) {
    const errorDetails = result.error.errors.map((error) => {
      const detail: Record<string, unknown> = {
        path: error.path.join('.'),
        message: error.message,
      };
      if (error.code === z.ZodIssueCode.invalid_type) {
        detail['expected'] = error.expected;
        detail['received'] = error.received;
      }
      return detail;
    });

    envLogging.error('❌ Failed to validate environment variables :');
    envLogging.error(inspect(errorDetails, { colors: true, depth: null }));
    envLogging.error(
      '\n🛠️  Please check your required environment variables :'
    );
    envLogging.error(
      GlobalConfigShema.description || '(no description provided)'
    );

    process.exit(1);
  }
  if (result.data?.NODE_ENV === 'development') {
    envLogging.log('✅ Configuration validated :');
    envLogging.log(
      inspect(result.data, { colors: true, depth: null, compact: true })
    );
  }
  return result.data as EnvVariables;
}
