import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DatabaseError } from '../errors/database.error';
import { TypeOrmError } from '../errors/typeorm.error';
import { DatabaseCatchError } from '../types/database.error.interface';

@Catch(QueryFailedError, TypeOrmError, DatabaseError)
export class DatabaseFilterException implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseFilterException.name);

  constructor() {
    this.logger.verbose('🧠 DatabaseFilterException initialized');
  }

  catch(exception: DatabaseCatchError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    //Log for traceability
    this.logger.warn(
      `Exception intercepted: ${
        exception.message
          ? exception.message
          : exception.toString() || 'Unknown Exception'
      }`
    );

    // SQL from ypeORM
    if (exception instanceof QueryFailedError) {
      this.logger.warn('→ Caught a TypeORM QueryFailedError');

      // 1️⃣ Get the "driverError" as unknown
      const maybeDriverError: unknown = (
        exception as QueryFailedError & { driverError?: unknown }
      ).driverError;

      // 2️⃣ Init sqlErrorCode to undefined (by défault)
      let sqlErrorCode: string | undefined;

      //3️⃣ Check that maybeDriverError is an object not null
      if (typeof maybeDriverError === 'object' && maybeDriverError !== null) {
        // 4️⃣ caste to Record<string, unknown> to read the property "code"
        const driverErrorObj = maybeDriverError as Record<string, unknown>;
        // 5️⃣ only retrieve the "code" if it's a string
        if (typeof driverErrorObj.code === 'string') {
          sqlErrorCode = driverErrorObj.code as string;
        }
      }

      switch (sqlErrorCode) {
        case '23505':
          return response.status(409).json({
            success: false,
            error: 'Conflict',
            message: 'Duplicate entry. Unique constraint violated.',
          });

        case '23503': // Violation de clé étrangère
          return response.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Foreign key constraint violation.',
          });

        case '23502': // Valeur NULL interdite
          return response.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Missing required field.',
          });

        default:
          return response.status(500).json({
            success: false,
            error: 'Database Error',
            message: 'An unknown database error occurred.',
          });
      }
    }

    // TypeOrmError
    if (exception instanceof TypeOrmError) {
      this.logger.warn('→ Caught a TypeOrmError');
      return response.status(500).json({
        success: false,
        error: exception.name,
        code: exception.code,
        message: exception.message,
        details: exception.details,
      });
    }
    //custom DatabaseError
    this.logger.warn('→ Caught a DatabaseError');
    return response.status(400).json({
      success: false,
      error: exception.name,
      code: exception.code,
      message: exception.message,
      details: exception.details,
    });
  }
}
