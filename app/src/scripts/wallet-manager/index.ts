import { selectedStorage } from "./store/variants/persistent-store";
import { KeyringController, KeyringEncryptedSerialized, VaultAccount } from "./controllers/keyring";
import { StoreInterface } from "./store/base-store";
import { EncryptorInterface } from "./encryptor";
import { PreferencesController, PreferencesData } from "./controllers/preferences";
import { ComposableStore } from "./store/composable-store";
import { CredentialsController, EditCredentialParams } from "./controllers/credentials";
import { VaultAccountController } from "./controllers/vault";
import { AccountData } from "store/actionTypes";

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
  private _memoryStoreCompose: ComposableStore<StoreInterface>;
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

    this._memoryStoreCompose = new ComposableStore<any>({
      stores: {
        keyring: this._keyringController.memoryStore,
        preferences: this._preferencesController.sessionStore
      }
    });
  }

  get api() {
    const {
      _keyringController,
      _credentialsController,
      _vaultAccountController,
      _preferencesController
    } = this;

    return {
      openPopup: this.openPopup.bind(this),
      registerNewWallet: this.registerNewWallet.bind(this),
      unlockWallet: this.unlockWallet.bind(this),
      selectAccount: this.selectAccount.bind(this),
      editAccount: this.editAccount.bind(this),
      lockWallet: this.lockWallet.bind(this),
      resetWallet: this.resetWallet.bind(this),
      isUnlocked: this.isUnlocked.bind(this),
      changeNetwork: this.changeNetwork.bind(this),
      getState: this.getState.bind(this),
      fullUpdate: this.fullUpdate.bind(this),
      addAccount: _keyringController.addAccount.bind(_keyringController),
      deleteAccount: _keyringController.deleteAccount.bind(_keyringController),
      getAccounts: _keyringController.getAccounts.bind(_keyringController),
      getAccount: _keyringController.getAccount.bind(_keyringController),
      createCredential: _credentialsController?.createCredential.bind(_credentialsController)!,
      editCredential: _credentialsController?.editCredential.bind(_credentialsController)!,
      deleteCredential: _credentialsController?.deleteCredential.bind(_credentialsController)!,
      getCredential: _credentialsController?.getCredential.bind(_credentialsController)!,
      getCredentials: _credentialsController?.getCredentials.bind(_credentialsController)!,
      getCredentialsFromCurrentTabURL:
        _credentialsController?.getCredentialsFromCurrentTabURL.bind(_credentialsController)!,
      getVaultDetails: _vaultAccountController?.getVaultDetails.bind(_vaultAccountController)!,
      getActivities: _vaultAccountController?.getActivities.bind(_vaultAccountController)!,
      requestAirdrop: _vaultAccountController?.requestAirdrop.bind(_vaultAccountController)!,
      getCurrentNetwork: _preferencesController.getCurrentNetwork.bind(_preferencesController)
    };
  }

  get credentialsController() {
    return this._credentialsController;
  }

  get vaultAccountController() {
    return this._vaultAccountController;
  }

  async openPopup(path?: string, customSearchParams?: { [key: string]: any }) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let popupUrl = await chrome.action.getPopup({ tabId: tab.id });
    const windowInfo = await chrome.windows.getCurrent();
    const width = 400;
    const height = 600;
    const top = windowInfo.top;
    const left = (windowInfo.width ? windowInfo.width - width : 0) + (windowInfo.left || 0);

    if (path) {
      popupUrl += `#/${path}`;
    }

    if (!customSearchParams) {
      customSearchParams = {};
    }
    customSearchParams["tab-id"] = tab.id;
    customSearchParams["window-id"] = tab.windowId;
    customSearchParams["origin"] = "popupInPage";

    chrome.windows.create({
      focused: true,
      url: `${popupUrl}?${new URLSearchParams(customSearchParams).toString()}`,
      type: "popup",
      height,
      width,
      top,
      left
    });
    return popupUrl;
  }

  async registerNewWallet(
    mnemonic: string,
    password: string,
    firstVaultAccount: { id?: string; publicKey: string; privateKey: string }
  ) {
    await this._keyringController.createKeyring(password, {
      mnemonic,
      accounts: []
    });
    const createdAccount = await this._keyringController.addAccount(firstVaultAccount);
    await this._preferencesController.setSelectedAccount({
      id: createdAccount.id,
      address: firstVaultAccount.publicKey
    });
    await this._preferencesController.changeNetwork(process.env.CLUSTER!);
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

  async selectAccount(address: string) {
    const selectedAccount: VaultAccount = (await this._keyringController.getAccount(address))!;
    if (selectedAccount) {
      await this._preferencesController.setSelectedAccount({
        id: selectedAccount.id,
        address: selectedAccount.publicKey
      });

      await this.fullUpdate();
    }
    return selectedAccount;
  }

  async editAccount(account: AccountData) {
    await this._keyringController.editAccount(account);

    const currentAccountKeyPair = await this.getSelectedAccountKeypair();
    if (currentAccountKeyPair?.publicKey.toBase58() === account.publicKey) {
      await this.selectAccount(account.publicKey);
    }
  }

  async lockWallet() {
    const vaultData = await this._keyringController.lock();
    return vaultData.isUnlocked;
  }

  async resetWallet(password: string) {
    await this._keyringController.unlock(password);
    await this._keyringController.reset();
    await this._preferencesController.reset();
    await this.fullUpdate();
  }

  async isUnlocked() {
    return (await this._keyringController.memoryStore.getState()).isUnlocked;
  }

  async changeNetwork(networkId: string) {
    await this._preferencesController.changeNetwork(networkId);
    await this.fullUpdate();
  }

  async getState() {
    const { vault } = await this._keyringController.persistentStore.getState();
    const isInitialized = Boolean(vault);

    return {
      isInitialized,
      ...(await this._memoryStoreCompose.getState())
    };
  }

  async getSelectedAccountKeypair() {
    try {
      const selectedAccount = await this._preferencesController.getSelectedAccount();
      return this._keyringController.getKeypairFromAddress(selectedAccount.address);
    } catch (e) {
      return null;
    }
  }

  async fullUpdate() {
    const keypair = await this.getSelectedAccountKeypair();

    if (keypair) {
      const password = (await this._keyringController.memoryStore.getState()).password;
      const clusterUrl = (await this._preferencesController.getCurrentNetwork()).url;

      this._credentialsController = new CredentialsController(
        clusterUrl,
        keypair,
        password as string
      );
      this._vaultAccountController = new VaultAccountController(
        this._credentialsController.ledgerProgram,
        keypair
      );

      chrome.windows.getAll({ populate: true }, (windows) => {
        windows.forEach((window) => {
          if (window.tabs) {
            window.tabs.forEach((tab) => {
              chrome.tabs.sendMessage(tab.id!, { action: "stateUpdated" });
            });
          }
        });
      });
    } else {
      this._credentialsController = undefined;
      this._vaultAccountController = undefined;
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
