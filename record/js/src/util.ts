import { Keypair, Connection, PublicKey, Transaction, TransactionSignature, sendAndConfirmTransaction } from '@solana/web3.js';

export class Util {
  static sendAndConfirmTransaction(
    connection: Connection,
    transaction: Transaction,
    ...signers: Array<Keypair>
  ): Promise<TransactionSignature> {
    return sendAndConfirmTransaction(connection, transaction, signers, {
      skipPreflight: false,
      commitment: 'recent',
      preflightCommitment: 'recent',
    });
  }

  static async newAccountWithLamports(
    connection: Connection,
    lamports: number = 1000000,
  ): Promise<Keypair> {
    const keypair = Keypair.generate();

    let retries = 30;
    const result = await connection.requestAirdrop(keypair.publicKey, lamports);
    for (;;) {
      await this.sleep(500);
      if (lamports == (await connection.getBalance(keypair.publicKey))) {
        return keypair;
      }
      if (--retries <= 0) {
        break;
      }
    }
    throw new Error(`Airdrop of ${lamports} failed`);
  }

  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
