import workspace, { SolanaWeb3Workspace } from "../solana/solanaWeb3";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface WalletDetails {
  address: string;
  balance: number;
}

export const getWalletDetails = async (): Promise<WalletDetails> => {
  const { connection, publicKey } = workspace() as SolanaWeb3Workspace;
  const walletInfo = await connection.getAccountInfo(publicKey);
  const walletAdress = publicKey.toBase58();
  const balance: number = (walletInfo?.lamports || 0) / LAMPORTS_PER_SOL;

  return { address: walletAdress, balance };
};
