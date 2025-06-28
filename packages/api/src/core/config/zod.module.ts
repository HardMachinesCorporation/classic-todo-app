import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ZodService } from './zod.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ZodService],
  exports: [],
})
export class ZodModule {}
