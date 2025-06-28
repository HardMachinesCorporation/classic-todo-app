/**
 * Custom error class for handling missing environment variables.
 *
 * @example
 * // Throws if DB_HOST is not defined for the production environment
 * throw new EnvVariableError('DB_HOST', 'production');
 *
 * @extends Error
 */
export class EnvVariableError extends Error {
  /**
   * Creates a new EnvVariableError.
   *
   * @param variable - The name of the missing environment variable.
   * @param env - The environment (e.g., 'development', 'production') where the variable is missing.
   */
  constructor(variable: string, env: string) {
    super(`Missing env variable ${variable} for ${env}`);
    this.name = 'EnvVariableError';
  }
}
