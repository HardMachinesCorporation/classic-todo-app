export * from './types/user';
export * from './types/todo';
export type { IApiResponse } from './types/api';
export type { IPaginationMeta } from './types/api';
export { UserSchema, type UserZod } from './schemas/user.schema';
export { TodoSchema, type TodoZod } from './schemas/todo.shema';

export const hello = 'hello from shared lib';
