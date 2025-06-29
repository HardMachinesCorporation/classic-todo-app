export abstract class IHashAlgorithm {
  abstract hash(password: string | Buffer): Promise<string>;
  abstract compare(
    provided: string | Buffer,
    encrypted: string
  ): Promise<boolean>;
}
