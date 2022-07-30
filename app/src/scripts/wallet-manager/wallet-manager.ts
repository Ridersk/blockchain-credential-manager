import bs58 from "bs58";
import selectedStorage from "../storage";
import {
  KeyringController,
  KeyringEncryptedSerialized,
  WalletAccount
} from "./controllers/keyring-controller";
import { MemoryStore } from "./store/memory-store";
import { EncryptorInterface } from "./encryptor";
import { WalletGenerator } from "./wallet-generator";
import { decryptData, encryptData } from "../../utils/aes-encryption";
import { PreferencesController, PreferencesData } from "./controllers/preferences";
import { ComposableStore } from "./store/composable-store";

type VaultInitialState = {
  keyring: KeyringEncryptedSerialized;
  preferences?: PreferencesData;
};

export type VaultManagerOpts = {
  initState?: VaultInitialState;
  encryptor?: EncryptorInterface;
};

export class VaultManager {
  private _keyringController: KeyringController;
  private _preferencesController: PreferencesController;
  private _memoryStore: ComposableStore<MemoryStore<any>>;

  constructor(opts: VaultManagerOpts = {}) {
    const { initState, encryptor } = opts;

    console.log("[Wallet] Init Keyring:", initState?.keyring);
    console.log("[Wallet] Init Preferences:", initState?.preferences);

    this._keyringController = new KeyringController({
      initState: initState?.keyring || ({} as KeyringEncryptedSerialized),
      encryptor: encryptor
    });

    this._preferencesController = new PreferencesController({
      initState: initState?.preferences || ({} as PreferencesData)
    });

    this._memoryStore = new ComposableStore<any>({
      stores: {
        keyring: this._keyringController.sessionStore,
        preferences: this._preferencesController.sessionStore
      }
    });
  }

  async registerNewWallet(mnemonic: string, password: string) {
    const walletKeyPair = await WalletGenerator.generateWalletKeypair(mnemonic);
    const accounts: WalletAccount[] = [
      {
        address: walletKeyPair.publicKey.toBase58(),
        privateKey: bs58.encode(walletKeyPair.secretKey)
      }
    ];

    await this._keyringController.createKeyring(password, {
      mnemonic,
      accounts
    });
    await this._preferencesController.setSelectedAddress(accounts[0].address);
    return walletKeyPair;
  }

  async unlockVault(password: string) {
    const vaultData = await this._keyringController.unlock(password);
    return Boolean(vaultData);
  }

  async isUnlocked() {
    return (await this._keyringController.sessionStore.getState()).isUnlocked;
  }

  async getState() {
    const { vault } = await this._keyringController.persistentStore.getState();
    const isInitialized = Boolean(vault);

    return {
      isInitialized,
      ...(await this._memoryStore.getState())
    };
  }

  async getSelectedAccountKeypair() {
    const selectedAddress = await this._preferencesController.getSelectedAddress();
    return this._keyringController.getKeypairFromAddress(selectedAddress);
  }

  async encryptMessage(data: { [key: string]: string }): Promise<{ [key: string]: string }> {
    const vaultKeypair = await this.getSelectedAccountKeypair();

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        encryptData(vaultKeypair?.secretKey as Uint8Array, value)
      ])
    );
  }

  async decryptMessage(data: { [key: string]: string }): Promise<{ [key: string]: string }> {
    const vaultKeypair = await this.getSelectedAccountKeypair();

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        decryptData(vaultKeypair?.secretKey as Uint8Array, value)
      ])
    );
  }
}

// TODO. Move Code to background.js
let vaultManagerInstance: VaultManager;
export async function initVaultManager(): Promise<VaultManager> {
  const initState = (await selectedStorage.getData()) as VaultInitialState;
  vaultManagerInstance = new VaultManager({ initState });
  return vaultManagerInstance;
}

export function getVaultManager(): VaultManager {
  return vaultManagerInstance;
}
