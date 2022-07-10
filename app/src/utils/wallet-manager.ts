import { generateMnemonic, mnemonicToSeed } from "bip39";
import { web3 } from "@project-serum/anchor";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import extensionStorage from "./storage";
import passEncryptor from "browser-passworder";
import { WalletIncorrectPasswordError, WalletInternallError } from "exceptions";

// TODO. Save Decrypted Vault in Memory DB
type KeyringData = {
  walletPrivateKey: string;
};
let walletKeyring: KeyringData | null = null;

export function generateWalletMnemonic(): string {
  return generateMnemonic();
}

export async function registerNewWallet(mnemonic: string, password: string): Promise<Keypair> {
  const walletKeyPair = await generateWalletKeypair(mnemonic);
  await saveWalletData(bs58.encode(walletKeyPair.secretKey), password);
  return walletKeyPair;
}

export async function generateWalletKeypair(mnemonic: string): Promise<Keypair> {
  const seed = await mnemonicToSeed(mnemonic);
  return web3.Keypair.fromSeed(new Uint8Array(seed.toJSON().data.slice(0, 32)));
}

async function saveWalletData(walletSecretKey: string, password: string) {
  const keyringData: KeyringData = {
    walletPrivateKey: walletSecretKey
  };
  const encryptedVault = await passEncryptor.encrypt(password, keyringData);
  await extensionStorage.setData("vault", encryptedVault);
}

export async function performLogin(password: string) {
  const vaultData = await unlockVault(password);
  walletKeyring = vaultData;
  const walletPublicAddress: string = getUserKeypairFromPrivateKeyEncoded(
    walletKeyring?.walletPrivateKey as string
  )?.publicKey?.toBase58() as string;
  console.log("LOGING KEYRING:", walletKeyring);

  if (vaultData) {
    await updateSessionExpiration();
    await extensionStorage.setData("walletAddress", walletPublicAddress);
    return true;
  }
  return false;
}

async function unlockVault(password: string, encryptedVaultData?: string) {
  try {
    const encryptedVault: string = (encryptedVaultData ||
      (await extensionStorage.getData("vault"))) as string;
    return await passEncryptor.decrypt(password, encryptedVault);
  } catch (err) {
    if (err instanceof Error && err.message === "Incorrect password") {
      throw new WalletIncorrectPasswordError();
    }
    throw err;
  }
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

// ************************************************************************
export const getUserKeypair = async (): Promise<Keypair | null> => {
  console.log("INITWORKSPACE KEYRING:", walletKeyring);

  return getUserKeypairFromPrivateKeyEncoded(walletKeyring?.walletPrivateKey as string);
};

function getUserKeypairFromPrivateKeyEncoded(privateKey: string) {
  let userKeypair: Keypair | null = null;
  if (privateKey) {
    const secret = bs58.decode(privateKey);
    userKeypair = Keypair.fromSecretKey(secret);
  }
  return userKeypair;
}
// ************************************************************************
