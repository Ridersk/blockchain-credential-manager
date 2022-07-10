import { generateMnemonic, mnemonicToSeed } from "bip39";
import { web3 } from "@project-serum/anchor";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { SHA256 } from "crypto-js";
import extensionStorage from "./storage";

export function generateWalletMnemonic(): string {
  return generateMnemonic();
}

export async function registerNewWallet(mnemonic: string, password: string): Promise<Keypair> {
  const walletKeyPair = await generateWalletKeypair(mnemonic);
  await saveWalletData(bs58.encode(walletKeyPair.secretKey), hashPassword(password));
  return walletKeyPair;
}

export async function generateWalletKeypair(mnemonic: string): Promise<Keypair> {
  const seed = await mnemonicToSeed(mnemonic);
  return web3.Keypair.fromSeed(new Uint8Array(seed.toJSON().data.slice(0, 32)));
}

export async function saveWalletData(walletSecretKey: string, password: string) {
  await extensionStorage.setData("userSecret", walletSecretKey);
  await extensionStorage.setData("walletPassword", password);
}

export async function performLogin(password: string) {
  const hashedSavedPassword = await extensionStorage.getData("walletPassword");
  const loginSuccess = hashPassword(password) == hashedSavedPassword;

  if (loginSuccess) {
    await updateSessionExpiration();
  }

  return loginSuccess;
}

export async function walletLogged() {
  const sessionExpiration = Number(await extensionStorage.getData("sessionExpiration"));

  if (!sessionExpiration || sessionExpiration < Date.now()) {
    await clearWalletSession();
    return false;
  }

  await updateSessionExpiration();
  return true;
}

async function updateSessionExpiration() {
  await extensionStorage.setData("sessionExpiration", String(calculateSessionExpiration()));
}

async function clearWalletSession() {
  await extensionStorage.deleteData("sessionExpiration");
}

function calculateSessionExpiration(): number {
  const SESSION_EXP_TIME = 60;
  const now = new Date();
  return now.setMinutes(now.getMinutes() + SESSION_EXP_TIME);
}

function hashPassword(password: string): string {
  return SHA256(password).toString();
}
