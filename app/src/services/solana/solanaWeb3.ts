import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";

import { BlockchainCredentialManager } from "idl/blockchain_credential_manager";

import idl from "idl/blockchain_credential_manager.json";
import bs58 from "bs58";
import extensionStorage from "utils/storage";
import { getUserKeypair } from "utils/wallet-manager";

const clusterUrl = process.env.REACT_APP_CLUSTER_URL || "devnet";
const preflightCommitment = "processed";
const commitment = "confirmed";
const programID = new PublicKey(idl.metadata.address);

export interface SolanaWeb3Workspace {
  userKeypair: Keypair;
  connection: Connection;
  program: Program<BlockchainCredentialManager>;
}

export class WalletCustom implements Wallet {
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

let workspace: SolanaWeb3Workspace | null = null;

export async function initWorkspace(): Promise<void> {
  const walletKeyPair = await getUserKeypair();
  const wallet = new WalletCustom(walletKeyPair as Keypair);

  const connection = new Connection(clusterUrl, commitment);
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment, commitment });
  const program = new Program<BlockchainCredentialManager>(idl as any, programID, provider);

  workspace = {
    userKeypair: walletKeyPair as Keypair,
    connection,
    program
  };
}

export default () => workspace;
