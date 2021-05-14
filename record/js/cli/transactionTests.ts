import { Keypair, Connection } from '@solana/web3.js';
import { RecordTransaction } from '../src/transaction';
import { Data } from '../src/record';
import { Util } from '../src/util';
import { strict as assert } from 'assert';

export async function testInitialize(connection: Connection) {
  console.log('Testing record creation');
  const data = new Data({bytes: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])});
  const payer = await Util.newAccountWithLamports(connection, 1000000000);
  const authority = Keypair.generate();
  const recordKey = await RecordTransaction.createRecord(connection, payer, authority, data);
  const rpcRecord = await RecordTransaction.getRecord(connection, recordKey.publicKey);
  assert.deepEqual(rpcRecord.data, data);
  assert.deepEqual(rpcRecord.version, 1);
  assert.deepEqual(rpcRecord.authority, authority.publicKey);
}
