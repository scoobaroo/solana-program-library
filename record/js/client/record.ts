import { PublicKey } from '@solana/web3.js';
import { Assignable, SCHEMA } from './solana-borsh';

export class Record extends Assignable {
  /// Struct version, allows for upgrades to the program
  version: number;
  /// The account allowed to update the data
  authority: RecordPublicKey;
  /// The data contained by the account, could be anything serializable
  data: Data;

  static size(): number {
    return 41; // TODO calculate the size based on schema
  }
}

export class Data extends Assignable {
  /// The data contained by the account, could be anything or serializable
  bytes: [number];
}

export class RecordPublicKey extends Assignable {
  // The public key bytes
  bytes: [number];

  toPublicKey(): PublicKey {
    return new PublicKey(this.bytes);
  }
}

SCHEMA.set(Record, {
  kind: 'struct',
  fields: [['version', 'u8'], ['authority', RecordPublicKey], ['data', Data]]
});
SCHEMA.set(Data, {
  kind: 'struct',
  fields: [['bytes', [8]]],
});
SCHEMA.set(RecordPublicKey, {
  kind: 'struct',
  fields: [['bytes', [32]]]
});
