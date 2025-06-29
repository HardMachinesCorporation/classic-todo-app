import { Module } from '@nestjs/common';

import { ZodModule } from './core/config/zod.module';
import { TodosModule } from './features/todos/todos.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [TodosModule, UsersModule, ZodModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
