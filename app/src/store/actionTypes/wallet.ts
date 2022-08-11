export enum WalletActionType {
  UPDATE_WALLET = "@wallet/UPDATE_WALLET",
  FORCE_UPDATE = "@wallet/FORCE_UPDATE",
  UNLOCK_WALLET = "@wallet/UNLOCK_WALLET",
  CREATE_NEW_WALLET = "@wallet/CREATE_NEW_WALLET"
}

export interface VaultData {
  id?: string;
  address?: string;
  balance?: number;
  mnemonic?: string;
}

export interface NewWalletData {
  password: string;
  mnemonic: string;
  firstVaultAccount: {
    publicKey: string;
    privateKey: string;
  };
}

interface UpdateWallet {
  type: WalletActionType.UPDATE_WALLET;
  data: VaultData;
}

interface UnlockWallet {
  type: WalletActionType.UNLOCK_WALLET;
  password: string;
}

interface CreateNewWallet {
  type: WalletActionType.CREATE_NEW_WALLET;
  data: NewWalletData;
}

export type WalletAction = UpdateWallet | UnlockWallet | CreateNewWallet;
