import { Module } from '@nestjs/common';

import { ZodModule } from './core/config/zod.module';
import { TodosModule } from './features/todos/todos.module';
import { UsersModule } from './features/users/users.module';
import { DatabaseModule } from './infra/database/database.module';

@Module({
  imports: [TodosModule, UsersModule, ZodModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
