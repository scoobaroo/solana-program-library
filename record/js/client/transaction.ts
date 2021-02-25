import { Data, Record } from './record';
import { Util } from './util';
import { PROGRAM_ID, initialize, write } from './instruction';
import { Account, Connection, PublicKey, SystemProgram, Transaction, TransactionSignature, sendAndConfirmTransaction } from '@solana/web3.js';
import * as BN from 'bn.js';

export class RecordTransaction {
  static async createRecord(connection: Connection, payer: Account, authority: Account, data: Data): Promise<Account> {
    const recordKey = new Account();

    // Allocate memory for the account
    const recordSize = Record.size();
    console.log('Getting rent');
    const balanceNeeded = await connection.getMinimumBalanceForRentExemption(recordSize);
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: recordKey.publicKey,
        lamports: balanceNeeded,
        space: recordSize,
        programId: PROGRAM_ID,
      }),
    );

    transaction.add(initialize(recordKey.publicKey, authority.publicKey));
    transaction.add(write(recordKey.publicKey, authority.publicKey, new BN(0), data.encode()));

    // Send the instructions
    console.log('Sending intructions');
    await Util.sendAndConfirmTransaction(connection, transaction, payer, recordKey, authority);
    console.log('Sent intructions');
    return recordKey;
  }

  static async getRecord(connection: Connection, recordKey: PublicKey): Promise<Record> {
    const data = await connection.getAccountInfo(recordKey);
    return Record.decode(data.data);
  }
}
