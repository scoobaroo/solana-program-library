import { Enum, Assignable, SCHEMA } from './solana-borsh';
import { AccountMeta, PublicKey, TransactionInstruction } from '@solana/web3.js';
import * as BN from 'bn.js';

export const PROGRAM_ID: PublicKey = new PublicKey(
  'ReciQBw6sQKH9TVVJQDnbnJ5W7FP539tPHjZhRF4E9r',
);

export class Initialize extends Assignable {
}

export class Write extends Assignable {
  offset: BN;
  data: Uint8Array;
}

export class SetAuthority extends Assignable {
}

export class CloseAccount extends Assignable {
}

export class RecordInstruction extends Enum {
  initialize: Initialize;
  write: Write;
  setAuthority: SetAuthority;
  closeAccount: CloseAccount;

  static initialize(): RecordInstruction {
    return new RecordInstruction({initialize: new Initialize({})});
  }

  static write(offset: BN, data: Uint8Array): RecordInstruction {
    return new RecordInstruction({write: new Write({offset, data})});
  }

  static setAuthority(): RecordInstruction {
    return new RecordInstruction({setAuthority: new SetAuthority({})});
  }

  static closeAccount(): RecordInstruction {
    return new RecordInstruction({closeAccount: new CloseAccount({})});
  }
}

export function initialize(recordAccount: PublicKey, authority: PublicKey): TransactionInstruction {
  const keys: AccountMeta[] = [
    {pubkey: recordAccount, isSigner: false, isWritable: true},
    {pubkey: authority, isSigner: false, isWritable: false},
  ];
  const data = RecordInstruction.initialize().encode();
  return new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
  });
}

export function write(recordAccount: PublicKey, authority: PublicKey, offset: BN, recordData: Uint8Array): TransactionInstruction {
  const keys: AccountMeta[] = [
    {pubkey: recordAccount, isSigner: false, isWritable: true},
    {pubkey: authority, isSigner: true, isWritable: false},
  ];
  const data = RecordInstruction.write(offset, recordData).encode();
  return new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
  });
}

SCHEMA.set(RecordInstruction, {kind: 'enum', field: 'enum', values: [
  ['initialize', Initialize],
  ['write', Write],
  ['setAuthority', SetAuthority],
  ['closeAccount', CloseAccount],
]});
SCHEMA.set(Initialize, {kind: 'struct', fields: []});
SCHEMA.set(Write, {kind: 'struct', fields: [
  ['offset', 'u64'],
  ['data', ['u8']],
]});
SCHEMA.set(SetAuthority, {kind: 'struct', fields: []});
SCHEMA.set(CloseAccount, {kind: 'struct', fields: []});
