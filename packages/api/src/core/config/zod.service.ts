import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables, NodeEnvironment } from './env/validate.env';

@Injectable()
export class ZodService {
  private readonly logger = new Logger(ZodService.name);
  private env!: EnvVariables['NODE_ENV'];
  private readonly cache: Map<string, unknown> = new Map();

  constructor(private readonly configService: ConfigService<EnvVariables>) {}

  onModuleInit() {
    this.env = this.getRaw('NODE_ENV') as NodeEnvironment;
    this.logger.log(`🚀 ZodConfiguration loaded for ${this.env} environment`);
  }

  /**
   * Retrieves the raw value of an environment variable from the configuration service.
   *
   * This method enforces the presence of a required environment variable and returns its value
   * with the correct type, as defined in `EnvVariables`. It uses the ConfigService to fetch the value
   * and supports automatic type inference.
   *
   * @typeParam K - A key from `EnvVariables`, representing the environment variable name.
   * @param key - The name of the environment variable to retrieve.
   * @returns The value of the specified environment variable, typed as `EnvVariables[K]`.
   *
   * @throws Error if the environment variable is missing, null, or an empty string.
   *
   * @example
   * const port = this.getRaw('APP_PORT'); // Ensures port is defined and typed
   */
  private getRaw<K extends keyof EnvVariables>(key: K): EnvVariables[K] {
    const value: string | number | undefined = this.configService.get(key, {
      infer: true,
    });
    if (value === undefined || value === null || value === '') {
      throw new Error(`Missing env variable ${key}`);
    }
    return value as EnvVariables[K];
  }

  /**
   * Retrieves the value of an environment variable, using an internal cache for performance.
   *
   * If the value has already been fetched, it returns the cached result.
   * Otherwise, it retrieves the raw value using `getRaw`, stores it in the cache,
   * and then returns it. Logs read/write operations for debugging purposes.
   *
   * @typeParam K - A key from `EnvVariables`, representing the environment variable name.
   * @param key - The environment variable key to retrieve.
   * @returns The value of the specified environment variable, typed as `EnvVariables[K]`.
   *
   * @example
   * const dbHost = this.getFromCache('DB_HOST');
   *
   * @remarks
   * This method is meant for internal use and assumes that all required env variables
   * are validated before runtime. It improves performance by avoiding redundant lookups.
   */
  private getFromCache<K extends keyof EnvVariables>(key: K): EnvVariables[K] {
    if (this.cache.has(key)) {
      this.logger.verbose('Reading configuration from cache ');
      return this.cache.get(key) as EnvVariables[K];
    }
    const rawValue: string | number = this.getRaw(key);
    this.cache.set(key, rawValue);
    this.logger.verbose(`Writing configuration for ${key} to the cache`);
    return rawValue as EnvVariables[K];
  }

  get frontendURL(): string {
    return this.getFromCache('FRONTEND_URL') as string;
  }
  get databaseURL(): string {
    return this.getFromCache('DATABASE_URL') as string;
  }
  get appPort(): number {
    return this.getFromCache('APP_PORT') as number;
  }
  get apiPrefix(): string {
    return this.getFromCache('API_PREFIX') as string;
  }

  get isDev(): boolean {
    return this.env === 'development';
  }
  get isProd(): boolean {
    return this.env === 'production';
  }
  get currentEnv(): NodeEnvironment {
    return this.env as 'development' | 'production';
  }
}
