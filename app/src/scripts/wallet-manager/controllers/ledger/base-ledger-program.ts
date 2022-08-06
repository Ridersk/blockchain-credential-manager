import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, Idl, Program, Wallet } from "@project-serum/anchor";

// const CLUSTER_URL = process.env.REACT_APP_CLUSTER_URL || "devnet";
const CLUSTER_URL = "http://127.0.0.1:8899" || "devnet";
const PREFLIGHT_COMMITMENT = "processed";
const COMMITMENT = "confirmed";

export class BaseLedgerProgram<IDL extends Idl = Idl> {
  wallet: WalletSigner;
  connection: Connection;
  provider: AnchorProvider;
  program: Program<IDL>;
  programID: PublicKey;

  constructor(keypair: Keypair, idl: IDL) {
    this.programID = new PublicKey(idl.metadata.address);
    this.wallet = new WalletSigner(keypair);
    this.connection = new Connection(CLUSTER_URL, COMMITMENT);
    this.provider = new AnchorProvider(this.connection, this.wallet, {
      preflightCommitment: PREFLIGHT_COMMITMENT,
      commitment: COMMITMENT
    });
    this.program = new Program<IDL>(idl, this.programID, this.provider);
  }
}

class WalletSigner implements Wallet {
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