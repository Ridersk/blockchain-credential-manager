import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
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
    const keyring = this._keyringController.getKeyring();
    const currentAccount = keyring?.accounts?.[0];

    return this._getUserKeypairFromPrivateKeyEncoded(currentAccount.privateKey);
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

// TODO. Move Code to background.js
let walletManagerInstance: VaultManager;
export async function initVaultManager(): Promise<VaultManager> {
  const keyring = (await selectedStorage.getData("keyring")) as KeyringSerialized;
  walletManagerInstance = new VaultManager({ initState: { keyring } });
  return walletManagerInstance;
}

export function getVaultManager(): VaultManager {
  return walletManagerInstance;
}
