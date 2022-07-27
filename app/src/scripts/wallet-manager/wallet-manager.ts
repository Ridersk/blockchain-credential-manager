import bs58 from "bs58";
import selectedStorage from "../storage";
import {
  KeyringController,
  KeyringEncryptedSerialized,
  VaultKeyring,
  WalletAccount
} from "./keyring-controller";
import { ComposableMemoryStore, MemoryStore } from "./memory-store";
import { EncryptorInterface } from "./encryptor";
import { WalletGenerator } from "./wallet-generator";
import { Keypair } from "@solana/web3.js";
import { decryptData, encryptData } from "../../utils/aes-encryption";

type VaultState = {
  currentAccount: {
    address: string;
  };
};

type VaultInitialState = {
  keyring: KeyringEncryptedSerialized;
  vaultState?: VaultState;
};

export type VaultManagerOpts = {
  initState?: VaultInitialState;
  encryptor?: EncryptorInterface;
};

export class VaultManager {
  private _keyringController: KeyringController;
  private _memoryStore: ComposableMemoryStore<MemoryStore<any>>;

  constructor(opts: VaultManagerOpts = {}) {
    const { initState, encryptor } = opts;

    this._keyringController = new KeyringController({
      initState: initState?.keyring || ({} as KeyringEncryptedSerialized),
      encryptor: encryptor
    });

    this._memoryStore = new ComposableMemoryStore<any>({
      stores: {
        keyring: this._keyringController.sessionStore
      }
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
    return Boolean(vaultData);
  }

  async isUnlocked() {
    return this._keyringController.sessionStore.getState().isUnlocked;
  }

  getState() {
    const { vault } = this._keyringController.encryptedStore.getState();
    const isInitialized = Boolean(vault);

    return {
      isInitialized,
      ...this._memoryStore.getState()
    };
  }

  async getSelectedAccountKeypair(): Promise<Keypair | null> {
    const keyring = await this._keyringController.getKeyring();
    const currentAccount = keyring?.accounts?.[0];

    if (currentAccount) {
      return this._getUserKeypairFromPrivateKeyEncoded(currentAccount?.privateKey);
    }
    return null;
  }

  async encryptMessage(data: { [key: string]: string }): Promise<{ [key: string]: string }> {
    console.log("[BACKGROUND] MESSAGE TOBE ENCRYPTED:", data);
    const vaultKeypair = await this.getSelectedAccountKeypair();

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        encryptData(vaultKeypair?.secretKey as Uint8Array, value)
      ])
    );
  }

  async decryptMessage(data: { [key: string]: string }): Promise<{ [key: string]: string }> {
    console.log("[BACKGROUND] MESSAGE TOBE DECRYPTED:", data);
    const vaultKeypair = await this.getSelectedAccountKeypair();

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        decryptData(vaultKeypair?.secretKey as Uint8Array, value)
      ])
    );
  }

  async _saveVaultData(password: string, mnemonic: string, accounts: WalletAccount[]) {
    const vaultKeyringData: VaultKeyring = {
      mnemonic,
      accounts
    };
    const encryptedVault = await this._keyringController.createKeyring(password, vaultKeyringData);
    await selectedStorage.setData("keyring", { vault: encryptedVault });
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

// TODO. Move Code to background.js
let vaultManagerInstance: VaultManager;
export async function initVaultManager(): Promise<VaultManager> {
  const keyring = (await selectedStorage.getData("keyring")) as KeyringEncryptedSerialized;
  vaultManagerInstance = new VaultManager({ initState: { keyring } });
  return vaultManagerInstance;
}

export function getVaultManager(): VaultManager {
  return vaultManagerInstance;
}
