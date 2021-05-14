import { PublicKey, Struct, SOLANA_SCHEMA } from '@solana/web3.js';

export class Record extends Struct {
  /// Struct version, allows for upgrades to the program
  version: number;
  /// The account allowed to update the data
  authority: PublicKey;
  /// The data contained by the account, could be anything serializable
  data: Data;

  static size(): number {
    return 41; // TODO calculate the size based on schema
  }
}

export class Data extends Struct {
  /// The data contained by the account, could be anything or serializable
  bytes: [number];
}

SOLANA_SCHEMA.set(Record, {
  kind: 'struct',
  fields: [['version', 'u8'], ['authority', PublicKey], ['data', Data]]
});
SOLANA_SCHEMA.set(Data, {
  kind: 'struct',
  fields: [['bytes', [8]]],
});
