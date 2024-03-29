import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, Idl, Program, Wallet } from "@project-serum/anchor";
import { sleep } from "../../../utils/time";
import Logger from "../../../utils/log";

export const COMMITMENT = "confirmed";
const PREFLIGHT_COMMITMENT = "processed";

export class LedgerProgram<IDL extends Idl = Idl> {
  vaultSigner: VaultAccountSigner;
  connection: Connection;
  provider: AnchorProvider;
  program: Program<IDL>;
  programID: PublicKey;

  constructor(url: string, keypair: Keypair, idl: IDL) {
    this.programID = new PublicKey(idl.metadata.address);
    this.vaultSigner = new VaultAccountSigner(keypair);
    this.connection = new Connection(url, COMMITMENT);
    this.provider = new AnchorProvider(this.connection, this.vaultSigner, {
      preflightCommitment: PREFLIGHT_COMMITMENT,
      commitment: COMMITMENT
    });
    this.program = new Program<IDL>(idl, this.programID, this.provider);

    Logger.info("CLUSTER_URL:", url);
  }

  async sendTransaction(transaction: Transaction, signer: Keypair) {
    const signature = await this.connection.sendTransaction(transaction, [signer]);
    await this.confirmTransaction(signature);
  }

  async confirmTransaction(signature: string) {
    const timeout = 30000;
    const startTime = Date.now();
    let waitTime = 200;
    while (true) {
      let status = await this.connection.getParsedTransaction(signature, COMMITMENT);
      if (status) {
        break;
      }
      if (Date.now() - startTime > timeout) {
        throw new Error("Transaction confirmation timeout");
      }
      await sleep(waitTime);
      waitTime = Math.min(waitTime * 1.1, 1000);
    }
  }
}

class VaultAccountSigner implements Wallet {
  constructor(readonly payer: Keypair) {
    this.payer = payer;
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx.partialSign(this.payer);
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer?.publicKey;
  }
}
