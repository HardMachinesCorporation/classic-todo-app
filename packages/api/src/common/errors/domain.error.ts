export abstract class DomainError extends Error {
  /** unique CODE to  identify the error (p.ex. 'BCRYPT_HASH_FAILED') */
  public readonly code!: string;
  /** Optional data (debug only) */
  public readonly info?: Record<string, unknown>;

  constructor(message: string, code: string, info?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.info = info;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
