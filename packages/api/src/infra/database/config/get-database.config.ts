import { Logger } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { zodConfig } from '../../../core/config/zod.config.singleton';
const dbConfigLogger = new Logger('DatabaseConfig');
export const getDatabaseConfig = (): DataSourceOptions => {
  dbConfigLogger.verbose('Getting database config');
  return {
    type: 'postgres',
    url: zodConfig.databaseURL,
    synchronize: false,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/infra/database/migrations/*.js'],
    migrationsRun: true,
    ssl: zodConfig.isProd ? { rejectUnauthorized: false } : false,
    extra: { connectionLimit: 10 },
  };
};
