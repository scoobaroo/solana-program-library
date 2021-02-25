import { Account } from '@solana/web3.js';
import { Assignable } from '../client/solana-borsh';
import { RecordPublicKey, Record, Data } from '../client/record';
import { RecordInstruction } from '../client/instruction';
import { encode } from 'bs58';
import * as BN from 'bn.js';
import { strict as assert } from 'assert';

export function testRecord() {
  const keypair = new Account();
  const recordKey = new RecordPublicKey({bytes: keypair.publicKey.toBuffer()});
  const record = new Record({version: 1, authority: recordKey, data: new Data({bytes: [1,2,3,4,5,6,7,8]})});
  testSerialization(Record, record);
}

export function testPublicKey() {
  const keypair = new Account();
  const publicKey = keypair.publicKey;
  const solanaBuffer = publicKey.toBuffer();
  const recordKey = new RecordPublicKey({bytes: solanaBuffer});
  const recordKeyBuffer = recordKey.encode();
  assert.deepEqual(solanaBuffer, recordKeyBuffer);
  assert.deepEqual(publicKey, recordKey.toPublicKey());
}

export function testInstructions() {
  testInitialize();
  testWrite();
  testSetAuthority();
  testCloseAccount();
}

function testSerialization(type: any, obj: any) {
  const serialized = obj.encode();
  const deserialized = type.decode(serialized);
  const reserialized = deserialized.encode();
  assert.deepEqual(serialized, reserialized);
}

function testInitialize() {
  const instruction = RecordInstruction.initialize();
  testSerialization(RecordInstruction, instruction);
}

function testWrite() {
  const offset = new BN('ffffffffffffffff', 16);
  const data = new Uint8Array([2, 4, 1, 2, 4]);
  const instruction = RecordInstruction.write(offset, data);
  testSerialization(RecordInstruction, instruction);
}

function testSetAuthority() {
  const instruction = RecordInstruction.setAuthority();
  testSerialization(RecordInstruction, instruction);
}

function testCloseAccount() {
  const instruction = RecordInstruction.closeAccount();
  testSerialization(RecordInstruction, instruction);
}
