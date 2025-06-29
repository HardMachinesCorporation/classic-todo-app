import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IHashAlgorithm } from '../abstract/hash.abstract.algorith';
import { HashError } from './errors/hash.error';

@Injectable()
export class BcryptjsProvider implements IHashAlgorithm {
  private readonly saltRounds = 10;

  async hash(password: string | Buffer): Promise<string> {
    const salt = bcrypt.genSaltSync(this.saltRounds);
    try {
      return await bcrypt.hash(password as string, salt);
    } catch (e) {
      throw new HashError('compare', (e as Error).message);
    }
  }
  async compare(
    provided: string | Buffer,
    encrypted: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(provided as string, encrypted);
    } catch (e: any) {
      throw new HashError('compare', (e as Error).message);
    }
  }
}
