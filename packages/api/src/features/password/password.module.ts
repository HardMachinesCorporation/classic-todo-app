import { Module } from '@nestjs/common';
import { IHashAlgorithm } from './security/abstract/hash.abstract.algorith';
import { BcryptjsProvider } from './security/implementation/bcryptjs.provider';
import { PasswordService } from './security/password.service';

@Module({
  providers: [
    PasswordService,
    {
      provide: IHashAlgorithm,
      useClass: BcryptjsProvider,
    },
  ],
  exports: [IHashAlgorithm, PasswordService],
})
export class PasswordModule {}
