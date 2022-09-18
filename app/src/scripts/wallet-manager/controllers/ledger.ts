import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, Idl, Program, Wallet } from "@project-serum/anchor";

export const CLUSTER_URL = process.env.REACT_APP_CLUSTER_URL!;
export const COMMITMENT = "confirmed";
const PREFLIGHT_COMMITMENT = "processed";

console.log("CLUSTER_URL:", CLUSTER_URL);
console.log(
  "IS BROWSER:",
  process.env.BROWSER || (typeof window !== "undefined" && !window.process?.hasOwnProperty("type"))
);

export class LedgerProgram<IDL extends Idl = Idl> {
  vaultSigner: VaultAccountSigner;
  connection: Connection;
  provider: AnchorProvider;
  program: Program<IDL>;
  programID: PublicKey;

  constructor(keypair: Keypair, idl: IDL) {
    this.programID = new PublicKey(idl.metadata.address);
    this.vaultSigner = new VaultAccountSigner(keypair);
    this.connection = new Connection(CLUSTER_URL, COMMITMENT);
    this.provider = new AnchorProvider(this.connection, this.vaultSigner, {
      preflightCommitment: PREFLIGHT_COMMITMENT,
      commitment: COMMITMENT
    });
    this.program = new Program<IDL>(idl, this.programID, this.provider);
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
