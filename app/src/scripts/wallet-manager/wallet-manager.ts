import bs58 from "bs58";
import selectedStorage from "../storage";
import {
  KeyringController,
  KeyringSerialized,
  VaultKeyring,
  WalletAccount
} from "./keyring-controller";
import { MemoryStore } from "./memory-store";
import { EncryptorInterface } from "./encryptor";
import { WalletGenerator } from "./wallet-generator";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import { decryptData, encryptData } from "../../utils/aes-encryption";

type VaultState = {
  currentAccount: {
    address: string;
  };
};

type VaultInitialState = {
  keyring: KeyringSerialized;
  vaultState?: VaultState;
};

export type VaultManagerOpts = {
  initState?: VaultInitialState;
  encryptor?: EncryptorInterface;
};

export class VaultManager {
  private _store: MemoryStore<VaultInitialState>;
  private _keyringController: KeyringController;

  constructor(opts: VaultManagerOpts = {}) {
    const { initState, encryptor } = opts;

    this._store = new MemoryStore<any>(initState);
    this._keyringController = new KeyringController({
      initState: initState?.keyring || ({} as KeyringSerialized),
      encryptor: encryptor
    });
  }

  async registerNewWallet(mnemonic: string, password: string): Promise<Keypair> {
    const walletKeyPair = await WalletGenerator.generateWalletKeypair(mnemonic);
    const accounts: WalletAccount[] = [{ privateKey: bs58.encode(walletKeyPair.secretKey) }];
    await this._saveVaultData(password, mnemonic, accounts);
    return walletKeyPair;
  }

  async unlockVault(password: string) {
    const vaultData = await this._keyringController.unlock(password);
    const walletPublicAddress: string = this._getUserKeypairFromPrivateKeyEncoded(
      vaultData?.accounts[0].privateKey as string
    )?.publicKey?.toBase58() as string;

    if (vaultData) {
      await this._updateSessionExpiration();
      await selectedStorage.setData("walletAddress", walletPublicAddress);
      return true;
    }
    return false;
  }

  async isUnlocked() {
    const sessionExpiration = Number(await selectedStorage.getData("sessionExpiration"));

    if (!sessionExpiration || sessionExpiration < Date.now()) {
      await this._clearWalletSession();
      return false;
    }

    await this._updateSessionExpiration();
    return true;
  }

  async getCurrentAccountKeypair(): Promise<Keypair | null> {
    const keyring = await this._keyringController.getKeyring();
    const currentAccount = keyring?.accounts?.[0];

    if (currentAccount) {
      return this._getUserKeypairFromPrivateKeyEncoded(currentAccount?.privateKey);
    }
    return null;
  }

  async getCurrentWalletSigner() {
    const walletKeyPair: Keypair = (await this.getCurrentAccountKeypair()) as Keypair;

    if (walletKeyPair) {
      return new WalletSigner(walletKeyPair);
    }

    return null;
  }

  async encryptMessage(data: { [key: string]: string }): Promise<{ [key: string]: string }> {
    console.log("[BACKGROUND] MESSAGE TOBE ENCRYPTED:", data);
    const vaultKeypair = await this.getCurrentAccountKeypair();

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        encryptData(vaultKeypair?.secretKey as Uint8Array, value)
      ])
    );

    // return Object.keys(data).reduce(function (result: { [key: string]: string }, key: string) {
    //   result[key] = encryptData(vaultKeypair?.secretKey as Uint8Array, data[key]);
    //   return result;
    // }, {});
  }

  async decryptMessage(data: { [key: string]: string }): Promise<{ [key: string]: string }> {
    console.log("[BACKGROUND] MESSAGE TOBE DECRYPTED:", data);
    const vaultKeypair = await this.getCurrentAccountKeypair();

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        decryptData(vaultKeypair?.secretKey as Uint8Array, value)
      ])
    );

    // return Object.keys(data).reduce(function (result: { [key: string]: string }, key: string) {
    //   result[key] = decryptData(vaultKeypair?.secretKey as Uint8Array, data[key]);
    //   return result;
    // }, {});
  }

  async _saveVaultData(password: string, mnemonic: string, accounts: WalletAccount[]) {
    const vaultKeyringData: VaultKeyring = {
      mnemonic,
      accounts
    };
    const encryptedVault = await this._keyringController.createKeyring(password, vaultKeyringData);
    await selectedStorage.setData("keyring", { vault: encryptedVault });
  }

  async _updateSessionExpiration() {
    await selectedStorage.setData("sessionExpiration", String(this._calculateSessionExpiration()));
  }

  async _clearWalletSession() {
    await selectedStorage.deleteData("sessionExpiration");
  }

  _calculateSessionExpiration(): number {
    const SESSION_EXP_TIME = 60;
    const now = new Date();
    return now.setMinutes(now.getMinutes() + SESSION_EXP_TIME);
  }

  _getUserKeypairFromPrivateKeyEncoded(privateKey: string): Keypair | null {
    let userKeypair: Keypair;
    if (privateKey) {
      const secret = bs58.decode(privateKey);
      userKeypair = Keypair.fromSecretKey(secret);
      return userKeypair;
    }

    return null;
  }
}

class WalletSigner implements Wallet {
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
    return this.payer?.publicKey;
  }
}

// TODO. Move Code to background.js
let vaultManagerInstance: VaultManager;
export async function initVaultManager(): Promise<VaultManager> {
  const keyring = (await selectedStorage.getData("keyring")) as KeyringSerialized;
  vaultManagerInstance = new VaultManager({ initState: { keyring } });
  return vaultManagerInstance;
}

export function getVaultManager(): VaultManager {
  return vaultManagerInstance;
}
