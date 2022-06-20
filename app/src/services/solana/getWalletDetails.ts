import getSolanaWorkspace from "../solana/solanaWeb3";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const { connection, userKeypair } = getSolanaWorkspace();

interface WalletDetails {
  address: string;
  balance: number;
}

export const getWalletDetails = async (): Promise<WalletDetails> => {
  const walletPublicKey = userKeypair.publicKey;
  const walletInfo = await connection.getAccountInfo(walletPublicKey);
  const walletAdress = walletPublicKey.toBase58();
  const balance: number = (walletInfo?.lamports || 0) / LAMPORTS_PER_SOL;

  console.log("WALLET ADDRESS:", walletAdress);

  return { address: walletAdress, balance };
};
