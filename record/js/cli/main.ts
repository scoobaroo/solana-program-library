import { Account, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { RecordPublicKey, Record, Data } from '../client/record';
import { strict as assert } from 'assert';

import { testRecord, testPublicKey, testInstructions } from './serdeTests';
import { testInitialize } from './transactionTests';

async function main() {
  testRecord();
  testPublicKey();
  testInstructions();

  const url = "http://127.0.0.1:8899";
  const connection = new Connection(url, 'recent');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', url, version);
  await testInitialize(connection);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(-1);
  })
  .then(() => process.exit());
