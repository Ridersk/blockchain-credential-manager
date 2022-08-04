import { EncryptorInterface } from "../encryptor";
import { MemoryStore } from "../store/memory-store";
import passEncryptor from "browser-passworder";
import {
  VaultIncorrectPasswordError,
  VaultNoKeyringFoundError,
  VaultLockedError
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

export type WalletAccount = {
  address: string;
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
        throw new VaultNoKeyringFoundError("Cannot unlock without a previous vault.");
      }

      const vault: VaultKeyring = await this._encryptor.decrypt(password, encryptedVault);
      await this._updateKeyring(password, vault);
      return (await this.sessionStore.getState()).keyring;
    } catch (err) {
      if (err instanceof Error && err.message === "Incorrect password") {
        throw new VaultIncorrectPasswordError("Incorrect password");
      }
      throw err;
    }
  }

  async createKeyring(password: string, keyring: VaultKeyring) {
    const encryptedVault = await this._encryptor.encrypt(password, keyring);
    await this.persistentStore.putState({ vault: encryptedVault });
    this._updateKeyring(password, keyring);

    return encryptedVault;
  }

  async getKeyring(): Promise<VaultKeyring> {
    const keyring = (await this.sessionStore.getState()).keyring;

    if (!keyring) {
      throw new VaultLockedError("Keyring is locked");
    }

    return keyring;
  }

  async getKeypairFromAddress(address: string): Promise<Keypair | null> {
    const keyring = await this.getKeyring();
    const account = keyring.accounts.find((_account) => _account.address === address);
    if (!account) {
      throw new Error("Account not found");
    }
    return this._getUserKeypairFromPrivateKeyEncoded(account.privateKey);
  }

  async _updateKeyring(password: string, vault: VaultKeyring) {
    this.sessionStore.updateState({
      isUnlocked: true,
      keyring: vault,
      password: password
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
  accounts: WalletAccount[];
  mnemonic: string;

  constructor(opts: KeyringOpts) {
    this.accounts = opts.accounts;
    this.mnemonic = opts.mnemonic;
  }
}
