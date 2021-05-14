import { Keypair, PublicKey } from '@solana/web3.js';
import { Assignable } from '../src/solana-borsh';
import { Record, Data } from '../src/record';
import { RecordInstruction } from '../src/instruction';
import { encode } from 'bs58';
import { strict as assert } from 'assert';

export function testRecord() {
  const keypair = Keypair.generate();
  const record = new Record({version: 1, authority: keypair.publicKey, data: new Data({bytes: [1,2,3,4,5,6,7,8]})});
  testSerialization(Record, record);
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
  const offset = 1_000_000;
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
