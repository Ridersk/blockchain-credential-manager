import { EncryptorInterface } from "./encryptor";
import { MemoryStore } from "./memory-store";
import passEncryptor from "browser-passworder";
import {
  VaultIncorrectPasswordError,
  VaultNoKeyringFoundError,
  VaultLockedError
} from "../../exceptions";

export type KeyringEncryptedSerialized = {
  vault: string;
};

export type SessionVault = {
  isUnlocked: boolean;
  keyring: VaultKeyring | null;
  password: string | null;
};

export type WalletAccount = {
  privateKey: string;
};

export type VaultKeyring = {
  mnemonic: string;
  accounts: WalletAccount[];
};

type KeyringControllerOpts = {
  initState?: KeyringEncryptedSerialized;
  encryptor?: EncryptorInterface;
};

export class KeyringController {
  encryptedStore: MemoryStore<KeyringEncryptedSerialized>;
  sessionStore: MemoryStore<SessionVault>;
  private _encryptor: EncryptorInterface;

  constructor(opts: KeyringControllerOpts) {
    const { initState, encryptor } = opts;

    this.encryptedStore = new MemoryStore<KeyringEncryptedSerialized>(initState);
    this.sessionStore = new MemoryStore<SessionVault>({
      isUnlocked: false,
      keyring: null,
      password: null
    });
    this._encryptor = encryptor || passEncryptor;
  }

  async unlock(password: string) {
    try {
      const encryptedVault: string = this.encryptedStore.getState().vault;
      if (!encryptedVault) {
        throw new VaultNoKeyringFoundError("Cannot unlock without a previous vault.");
      }

      const vault: VaultKeyring = await this._encryptor.decrypt(password, encryptedVault);
      await this._updateKeyring(password, vault);
      return this.sessionStore.getState().keyring;
    } catch (err) {
      console.log(err);
      if (err instanceof Error && err.message === "Incorrect password") {
        throw new VaultIncorrectPasswordError("Incorrect password");
      }
      throw err;
    }
  }

  async createKeyring(password: string, keyring: VaultKeyring) {
    const encryptedVault = await this._encryptor.encrypt(password, keyring);
    this.encryptedStore.putState({ vault: encryptedVault });
    this._updateKeyring(password, keyring);

    return encryptedVault;
  }

  async getKeyring(): Promise<VaultKeyring> {
    // const keyring = this._keyring || (await chrome.storage.session.get("keyring")).keyring;
    const keyring = this.sessionStore.getState().keyring;

    if (!keyring) {
      throw new VaultLockedError("Keyring is locked");
    }
    return keyring;
  }

  async _updateKeyring(password: string, vault: VaultKeyring) {
    this.sessionStore.updateState({
      isUnlocked: true,
      keyring: vault,
      password: password
    });
    // this._password = password;
    // this._keyring = vault;

    // await chrome.storage.session.set({ keyring: vault });
    // await chrome.storage.session.set({ password: password });
  }
}

export type KeyringOpts = VaultKeyring;

export class Keyring {
  accounts: WalletAccount[];
  mnemonic: string;

  constructor(opts: KeyringOpts) {
    this.accounts = opts.accounts;
    this.mnemonic = opts.mnemonic;
  }
}
