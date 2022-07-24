import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";

import { BlockchainCredentialManager } from "idl/blockchain_credential_manager";

import idl from "idl/blockchain_credential_manager.json";

const clusterUrl = process.env.REACT_APP_CLUSTER_URL || "devnet";
const preflightCommitment = "processed";
const commitment = "confirmed";
const programID = new PublicKey(idl.metadata.address);

export interface SolanaWeb3Workspace {
  publicKey: PublicKey;
  connection: Connection;
  program: Program<BlockchainCredentialManager>;
}

let workspace: SolanaWeb3Workspace | null = null;

export async function initWorkspace(publicKey: string): Promise<void> {
  const wallet = await getWalletSignerFromBackgroundAction();
  const connection = new Connection(clusterUrl, commitment);
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment, commitment });
  const program = new Program<BlockchainCredentialManager>(idl as any, programID, provider);

  workspace = {
    publicKey: new PublicKey(publicKey),
    connection,
    program
  };
}

export default () => workspace;

const getWalletSignerFromBackgroundAction = async (): Promise<Wallet> => {
  const response = await chrome.runtime.sendMessage({
    action: "getWalletSigner"
  });
  const walletSigner: Wallet = response?.data.walletSigner;
  console.log("[POPUP] Wallet Signer:", walletSigner);
  return walletSigner;
};
