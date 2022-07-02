import { generateMnemonic, mnemonicToSeed } from "bip39";
import { web3 } from "@project-serum/anchor";
import { setCookie } from "utils/cookie";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { SHA256 } from "crypto-js";

export function generateWalletMnemonic(): string {
  return generateMnemonic();
}

export async function registerNewWallet(mnemonic: string, password: string): Promise<Keypair> {
  const walletKeyPair = await generateWalletKeypair(mnemonic);
  saveWalletData(bs58.encode(walletKeyPair.secretKey), hashPassword(password));
  return walletKeyPair;
}

export async function generateWalletKeypair(mnemonic: string): Promise<Keypair> {
  const seed = await mnemonicToSeed(mnemonic);
  return web3.Keypair.fromSeed(new Uint8Array(seed.toJSON().data.slice(0, 32)));
}

export function saveWalletData(walletSecretKey: string, password: string) {
  setCookie("userSecret", walletSecretKey);
  setCookie("walletPassword", password);
}

function hashPassword(password: string): string {
  return SHA256(password).toString();
}
