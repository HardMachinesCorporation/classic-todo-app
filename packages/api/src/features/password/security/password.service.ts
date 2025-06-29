import { Injectable, Logger } from '@nestjs/common';
import { IHashAlgorithm } from './abstract/hash.abstract.algorith';

@Injectable()
export class PasswordService {
  private readonly securityLogger = new Logger(PasswordService.name);
  constructor(private readonly hashProvider: IHashAlgorithm) {
    this.securityLogger.verbose('PasswordService initialized');
  }

  async comparePassword(provided: string, encrypted: string): Promise<boolean> {
    return await this.hashProvider.compare(provided, encrypted);
  }
  async hashPassword(password: string): Promise<string> {
    return await this.hashProvider.hash(password);
  }
}
