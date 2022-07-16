import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";

import { BlockchainCredentialManager } from "idl/blockchain_credential_manager";

import idl from "idl/blockchain_credential_manager.json";

const clusterUrl = process.env.REACT_APP_CLUSTER_URL || "devnet";
const preflightCommitment = "processed";
const commitment = "confirmed";
const programID = new PublicKey(idl.metadata.address);

export interface SolanaWeb3Workspace {
  userKeypair: Keypair;
  connection: Connection;
  program: Program<BlockchainCredentialManager>;
}

let workspace: SolanaWeb3Workspace | null = null;

export async function initWorkspace(walletKeyPair: Keypair): Promise<void> {
  const wallet = new WalletCustomWrapper(walletKeyPair);
  const connection = new Connection(clusterUrl, commitment);
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment, commitment });
  const program = new Program<BlockchainCredentialManager>(idl as any, programID, provider);

  workspace = {
    userKeypair: walletKeyPair,
    connection,
    program
  };
}

export default () => workspace;

class WalletCustomWrapper implements Wallet {
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
    return this.payer.publicKey;
  }
}
