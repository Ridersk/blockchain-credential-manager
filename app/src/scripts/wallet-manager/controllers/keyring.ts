import { EncryptorInterface } from "../encryptor";
import { MemoryStore } from "../store/memory-store";
import passEncryptor from "browser-passworder";
import {
  WalletIncorrectPasswordError,
  WalletNoKeyringFoundError,
  WalletLockedError,
  AccountAlreadyExistsError
} from "../../../exceptions";
import { PersistentStore } from "../store/persistent-store";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export type KeyringEncryptedSerialized = {
  vault: string;
};

export type SessionVault = {
  isUnlocked: boolean;
  keyring: VaultKeyring | null;
  password: string | null;
};

export type VaultAccount = {
  id: string;
  publicKey: string;
  privateKey: string;
};

export type VaultKeyring = {
  mnemonic: string;
  accounts: VaultAccount[];
};

type KeyringControllerOpts = {
  initState?: KeyringEncryptedSerialized;
  encryptor?: EncryptorInterface;
};

export class KeyringController {
  persistentStore: PersistentStore<KeyringEncryptedSerialized>;
  sessionStore: MemoryStore<SessionVault>;
  private _encryptor: EncryptorInterface;

  constructor(opts: KeyringControllerOpts) {
    const { initState, encryptor } = opts;

    this.persistentStore = new PersistentStore<KeyringEncryptedSerialized>("keyring", initState);
    this.sessionStore = new MemoryStore<SessionVault>("keyring", {
      isUnlocked: false,
      keyring: null,
      password: null
    });
    this._encryptor = encryptor || passEncryptor;
  }

  async unlock(password: string) {
    try {
      const encryptedVault: string = (await this.persistentStore.getState()).vault;
      if (!encryptedVault) {
        throw new WalletNoKeyringFoundError("Cannot unlock without a previous vault.");
      }

      const vault: VaultKeyring = await this._encryptor.decrypt(password, encryptedVault);
      await this._updateKeyringSession(password, vault);
      return (await this.sessionStore.getState()).keyring;
    } catch (err) {
      if (err instanceof Error && err.message === "Incorrect password") {
        throw new WalletIncorrectPasswordError("Incorrect password");
      }
      throw err;
    }
  }

  async lock() {
    try {
      await this._updateKeyringSession(null, null, false);
      return await this.sessionStore.getState();
    } catch (err) {
      throw new WalletLockedError("Error on locking keyring");
    }
  }

  async createKeyring(password: string, keyring: VaultKeyring) {
    await this._updatePersistentKeyring(password, keyring);
  }

  async getKeyring(): Promise<VaultKeyring> {
    const keyring = (await this.sessionStore.getState()).keyring;

    if (!keyring) {
      throw new WalletLockedError("Keyring is locked");
    }

    return keyring;
  }

  async addAccount(account: VaultAccount) {
    const keyring = await this.getKeyring();
    const oldAccounts = await this.getAccounts();

    if (oldAccounts.filter(({ publicKey }) => publicKey === account.publicKey).length > 0) {
      throw new AccountAlreadyExistsError("Account already exists");
    }

    keyring.accounts.push(account);
    const password = (await this.sessionStore.getState()).password!;
    await this._updatePersistentKeyring(password, keyring);
  }

  async getAccounts(): Promise<VaultAccount[]> {
    const keyring = await this.getKeyring();
    return keyring.accounts;
  }

  async getAccount(address: string): Promise<VaultAccount | undefined> {
    const keyring = await this.getKeyring();
    return keyring.accounts.find((_account) => _account.publicKey === address);
  }

  async getKeypairFromAddress(address: string): Promise<Keypair | null> {
    const keyring = await this.getKeyring();
    const account = keyring.accounts.find((_account) => _account.publicKey === address);
    if (!account) {
      throw new Error("Account not found");
    }
    return this._getUserKeypairFromPrivateKeyEncoded(account.privateKey);
  }

  async _updatePersistentKeyring(password: string, keyring: VaultKeyring) {
    const encryptedVault = await this._encryptor.encrypt(password, keyring);
    await this.persistentStore.putState({ vault: encryptedVault });
    await this._updateKeyringSession(password, keyring);
  }

  async _updateKeyringSession(
    password: string | null,
    keyring: VaultKeyring | null,
    isUnlocked: boolean = true
  ) {
    await this.sessionStore.updateState({
      isUnlocked,
      keyring,
      password
    });
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

export type KeyringOpts = VaultKeyring;

export class Keyring {
  accounts: VaultAccount[];
  mnemonic: string;

  constructor(opts: KeyringOpts) {
    this.accounts = opts.accounts;
    this.mnemonic = opts.mnemonic;
  }
}
