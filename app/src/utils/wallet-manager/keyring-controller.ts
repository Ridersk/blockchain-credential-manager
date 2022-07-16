import { EncryptorInterface } from "./encryptor";
import { MemoryStore } from "./memory-store";
import passEncryptor from "browser-passworder";
import { VaultIncorrectPasswordError, VaultNoKeyringFoundError } from "exceptions";

export type KeyringSerialized = {
  vault: string;
};

export type WalletAccount = {
  privateKey: string;
};

export type VaultKeyring = {
  mnemonic: string;
  accounts: WalletAccount[];
};

type KeyringControllerOpts = {
  initState?: KeyringSerialized;
  encryptor?: EncryptorInterface;
};

export class KeyringController {
  private _keyring?: Keyring;
  private _store: MemoryStore<KeyringSerialized>;
  private _encryptor: EncryptorInterface;
  private _password?: string;

  constructor(opts: KeyringControllerOpts) {
    const { initState, encryptor } = opts;

    this._store = new MemoryStore<KeyringSerialized>(initState);
    this._encryptor = encryptor || passEncryptor;
  }

  async unlock(password: string) {
    try {
      const encryptedVault: string = this._store.getState().vault;
      if (!encryptedVault) {
        throw new VaultNoKeyringFoundError("Cannot unlock without a previous vault.");
      }

      const vault: VaultKeyring = await this._encryptor.decrypt(password, encryptedVault);
      this._updateKeyring(password, vault);
      return this._keyring;
    } catch (err) {
      if (err instanceof Error && err.message === "Incorrect password") {
        throw new VaultIncorrectPasswordError("Incorrect password");
      }
      throw err;
    }
  }

  async createKeyring(password: string, keyring: VaultKeyring) {
    const encryptedVault = await this._encryptor.encrypt(password, keyring);
    this._store.putState({ vault: encryptedVault });
    this._updateKeyring(password, keyring);

    return encryptedVault;
  }

  getKeyring(): Keyring {
    if (!this._keyring) {
      throw new Error("Keyring is not unlocked");
    }
    return this._keyring;
  }

  _updateKeyring(password: string, vault: VaultKeyring) {
    this._password = password;
    this._keyring = vault;
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
