import { Module } from '@nestjs/common';

import { TodosModule } from './features/todos/todos.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [TodosModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
