import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZodModule } from '../../core/config/zod.module';
import { getDatabaseConfig } from './config/get-database.config';

@Module({
  imports: [
    ZodModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);
  onModuleInit() {
    this.logger.log('Database module initialized');
  }
}
