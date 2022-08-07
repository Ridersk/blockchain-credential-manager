import bs58 from "bs58";
import selectedStorage from "../storage";
import { KeyringController, KeyringEncryptedSerialized, VaultAccount } from "./controllers/keyring";
import { MemoryStore } from "./store/memory-store";
import { EncryptorInterface } from "./encryptor";
import { AccountGenerator } from "../../utils/account-generator";
import { PreferencesController, PreferencesData } from "./controllers/preferences";
import { ComposableStore } from "./store/composable-store";
import { CredentialsController } from "./controllers/credentials";
import { VaultAccountController } from "./controllers/vault";

type WalletInitialState = {
  keyring: KeyringEncryptedSerialized;
  preferences?: PreferencesData;
};

export type WalletManagerOpts = {
  initState?: WalletInitialState;
  encryptor?: EncryptorInterface;
};

export class WalletManager {
  private _keyringController: KeyringController;
  private _preferencesController: PreferencesController;
  private _memoryStore: ComposableStore<MemoryStore<any>>;
  private _credentialsController?: CredentialsController;
  private _accountController?: VaultAccountController;

  constructor(opts: WalletManagerOpts = {}) {
    const { initState, encryptor } = opts;

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

  get credentialsController() {
    return this._credentialsController;
  }

  get accountController() {
    return this._accountController;
  }

  async registerNewVault(mnemonic: string, password: string) {
    const vaultKeyPair = await AccountGenerator.generateAccountKeypair(mnemonic);
    const accounts: VaultAccount[] = [
      {
        address: vaultKeyPair.publicKey.toBase58(),
        privateKey: bs58.encode(vaultKeyPair.secretKey)
      }
    ];

    await this._keyringController.createKeyring(password, {
      mnemonic,
      accounts
    });
    await this._preferencesController.setSelectedAddress(accounts[0].address);
    return vaultKeyPair;
  }

  async unlockWallet(password: string) {
    let unlocked = false;
    try {
      const vaultData = await this._keyringController.unlock(password);
      unlocked = Boolean(vaultData);
      if (unlocked) {
        await this.fullUpdate();
      }
    } catch (e) {}
    return unlocked;
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
    try {
      const selectedAddress = await this._preferencesController.getSelectedAddress();
      return this._keyringController.getKeypairFromAddress(selectedAddress);
    } catch (e) {
      return null;
    }
  }

  async fullUpdate() {
    const keypair = await this.getSelectedAccountKeypair();

    if (keypair) {
      const password = (await this._keyringController.sessionStore.getState()).password;

      this._credentialsController = new CredentialsController(keypair, password as string);
      this._accountController = new VaultAccountController(
        this._credentialsController.ledgerProgram,
        keypair
      );
    }
  }
}

// TODO. Move Code to background.js
let vaultManagerInstance: WalletManager;
export async function initVaultManager(): Promise<WalletManager> {
  const initState = (await selectedStorage.getData()) as WalletInitialState;
  vaultManagerInstance = new WalletManager({ initState });
  vaultManagerInstance.fullUpdate();
  return vaultManagerInstance;
}

export function getVaultManager(): WalletManager {
  return vaultManagerInstance;
}
