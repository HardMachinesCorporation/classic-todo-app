import { QueryFailedError } from 'typeorm';
import { DatabaseError } from '../errors/database.error';
import { TypeOrmError } from '../errors/typeorm.error';

export type DatabaseCatchError =
  | QueryFailedError
  | TypeOrmError
  | DatabaseError;
