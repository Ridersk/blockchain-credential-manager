import workspace, { SolanaWeb3Workspace } from "../solana/solanaWeb3";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface WalletDetails {
  address: string;
  balance: number;
}

export const getWalletDetails = async (): Promise<WalletDetails> => {
  const { connection, userKeypair } = workspace() as SolanaWeb3Workspace;
  const walletPublicKey = userKeypair.publicKey;
  const walletInfo = await connection.getAccountInfo(walletPublicKey);
  const walletAdress = walletPublicKey.toBase58();
  const balance: number = (walletInfo?.lamports || 0) / LAMPORTS_PER_SOL;

  return { address: walletAdress, balance };
};
