import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";

import { BlockchainCredentialManager } from "idl/blockchain_credential_manager";

import idl from "idl/blockchain_credential_manager.json";
import bs58 from "bs58";
import extensionStorage from "utils/storage";

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

// ************************************************************************
const getUserKeypair = async (): Promise<Keypair | null> => {
  let userKeypair: Keypair | null = null;
  const secretBs58Saved: string = (await extensionStorage.getData("userSecret")) as string;
  if (secretBs58Saved) {
    const secret = bs58.decode(secretBs58Saved);
    userKeypair = Keypair.fromSecretKey(secret);
  }

  // else {
  //   userKeypair = Keypair.generate();
  //   setCookie("userSecret", bs58.encode(userKeypair.secretKey));
  // }

  return userKeypair;
};
// ************************************************************************

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
