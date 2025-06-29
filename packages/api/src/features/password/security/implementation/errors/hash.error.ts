// src/common/errors/hash.error.ts
import { DomainError } from '../../../../../common/errors/domain.error';

export class HashError extends DomainError {
  constructor(operation: 'hash' | 'compare', details?: string) {
    super(
      `BCRYPT_${operation.toUpperCase()}_FAILED`,
      operation === 'hash'
        ? 'Unable to hash password'
        : 'Unable to compare credentials',
      { operation, details }
    );
  }
}
