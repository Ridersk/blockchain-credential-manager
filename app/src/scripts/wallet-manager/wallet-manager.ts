import selectedStorage from "../storage";
import { KeyringController, KeyringEncryptedSerialized } from "./controllers/keyring";
import { MemoryStore } from "./store/memory-store";
import { EncryptorInterface } from "./encryptor";
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
  private _vaultAccountController?: VaultAccountController;

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

    this.registerNewWallet = this.registerNewWallet.bind(this);
    this.unlockWallet = this.unlockWallet.bind(this);
    this.isUnlocked = this.isUnlocked.bind(this);
    this.getState = this.getState.bind(this);
    this.getSelectedAccountKeypair = this.getSelectedAccountKeypair.bind(this);
    this.fullUpdate = this.fullUpdate.bind(this);
  }

  get api() {
    const { _credentialsController, _vaultAccountController } = this;

    return {
      registerNewWallet: this.registerNewWallet.bind(this),
      unlockWallet: this.unlockWallet.bind(this),
      isUnlocked: this.isUnlocked.bind(this),
      getState: this.getState.bind(this),
      createCredential: _credentialsController?.createCredential.bind(_credentialsController)!,
      editCredential: _credentialsController?.editCredential.bind(_credentialsController)!,
      deleteCredential: _credentialsController?.deleteCredential.bind(_credentialsController)!,
      getCredential: _credentialsController?.getCredential.bind(_credentialsController)!,
      getCredentials: _credentialsController?.getCredentials.bind(_credentialsController)!,
      getVaultDetails: _vaultAccountController?.getVaultDetails.bind(_vaultAccountController)!,
      getActivities: _vaultAccountController?.getActivities.bind(_vaultAccountController)!,
      requestAirdrop: _vaultAccountController?.requestAirdrop.bind(_vaultAccountController)!
    };
  }

  get credentialsController() {
    return this._credentialsController;
  }

  get vaultAccountController() {
    return this._vaultAccountController;
  }

  async registerNewWallet(
    mnemonic: string,
    password: string,
    firstVaultAccount: { publicKey: string; privateKey: string }
  ) {
    const firstAccount = {
      address: firstVaultAccount.publicKey,
      privateKey: firstVaultAccount.privateKey
    };
    await this._keyringController.createKeyring(password, {
      mnemonic,
      accounts: [firstAccount]
    });
    await this._preferencesController.setSelectedAddress(firstAccount.address);
    return firstAccount;
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
      this._vaultAccountController = new VaultAccountController(
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
