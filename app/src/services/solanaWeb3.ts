import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";

import { BlockchainCredentialManager } from "idl/blockchain_credential_manager";

import idl from "idl/blockchain_credential_manager.json";
import { getCookie, setCookie } from "utils/cookie";
import bs58 from "bs58";

const clusterUrl = process.env.REACT_APP_CLUSTER_URL || "devnet";
const preflightCommitment = "processed";
const commitment = "processed";
const programID = new PublicKey(idl.metadata.address);

// User keypair credentials
const secretBs58Saved = getCookie("userSecret");
let userKeypair: Keypair;
if (secretBs58Saved) {
  const secret = bs58.decode(secretBs58Saved);
  userKeypair = Keypair.fromSecretKey(secret);
} else {
  userKeypair = Keypair.generate();
  setCookie("userSecret", bs58.encode(userKeypair.secretKey));
}

interface SolanaWeb3Workspace {
  userKeypair: Keypair;
  // wallet: MyWallet;
  connection: Connection;
  provider: AnchorProvider;
  program: Program<BlockchainCredentialManager>;
}

export class MyWallet implements Wallet {
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

export const solanaWeb3 = (): SolanaWeb3Workspace => {
  // User wallet
  const wallet = new MyWallet(userKeypair);

  const connection = new Connection(clusterUrl, commitment);
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment, commitment });
  const program = new Program<BlockchainCredentialManager>(idl, programID, provider);

  return {
    userKeypair,
    // wallet,
    connection,
    provider,
    program
  };
};

export const requestAirdrop = async (program: Program<BlockchainCredentialManager>, author: Keypair) => {
  // Request airdrop of 1 SOL
  await program.provider.connection.confirmTransaction(await program.provider.connection.requestAirdrop(author.publicKey, 1000000000));
  console.log("Airdrop Provided!!!");
};
