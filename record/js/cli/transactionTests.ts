import { Account, Connection } from '@solana/web3.js';
import { RecordTransaction } from '../client/transaction';
import { Data } from '../client/record';
import { Util } from '../client/util';
import { strict as assert } from 'assert';

export async function testInitialize(connection: Connection) {
  console.log('Testing record creation');
  const data = new Data({bytes: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])});
  const payer = await Util.newAccountWithLamports(connection, 1000000000);
  const authority = new Account();
  const recordKey = await RecordTransaction.createRecord(connection, payer, authority, data);
  const rpcRecord = await RecordTransaction.getRecord(connection, recordKey.publicKey);
  assert.deepEqual(rpcRecord.data, data);
  assert.deepEqual(rpcRecord.version, 1);
  assert.deepEqual(rpcRecord.authority.toPublicKey(), authority.publicKey);
}
