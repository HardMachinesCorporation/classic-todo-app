export const PG_ERROR_MESSAGES: Record<string, string> = {
  '23505': 'This field must be unique. This record already exists.',
  '23503': 'Foreign key violation.',
  '23502': 'A required field is missing.',
  '08001': 'Failed to connect to the database.',
  '40P01': 'A deadlock was detected.',
} as const;

export const TYPEORM_ERROR_MESSAGES: Record<string, string> = {
  ER_DUP_ENTRY: 'Unique key violation detected.',
  ER_NO_REFERENCED_ROW: 'Foreign key constraint violation.',
  ER_NO_DEFAULT_FOR_FIELD: 'A required field is missing.',
  ER_LOCK_DEADLOCK: 'A database deadlock was detected.',
  ER_QUERY_INTERRUPTED: 'The query was interrupted.',
  ER_SYNTAX_ERROR: 'SQL syntax error.',
  ER_ACCESS_DENIED_ERROR: 'Database access denied.',
  ER_UNKNOWN_ERROR: 'An unknown TypeORM error occurred.',
} as const;
