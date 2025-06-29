import { TYPEORM_ERROR_MESSAGES } from './constant';
import { ErrorDetail } from './error-detail.interface';

export class TypeOrmError extends Error {
  code: string;
  details?: ErrorDetail;
  constructor(code: string, message?: string, details?: string) {
    super(TYPEORM_ERROR_MESSAGES[code] || message || 'Unknown TypeOrm error');
    this.name = 'TypeOrmError';
    this.code = code;
    this.details = details as unknown as ErrorDetail;
  }
}
