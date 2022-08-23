export enum WalletActionType {
  UPDATE_WALLET = "@wallet/UPDATE_WALLET",
  FORCE_UPDATE = "@wallet/FORCE_UPDATE",
  CREATE_NEW_WALLET = "@wallet/CREATE_NEW_WALLET",
  UNLOCK_WALLET = "@wallet/UNLOCK_WALLET",
  LOCK_WALLET = "@wallet/LOCK_WALLET",
  ADD_NEW_ACCOUNT = "@wallet/ADD_NEW_ACCOUNT",
  EDIT_ACCOUNT = "@wallet/EDIT_ACCOUNT",
  GET_ACCOUNTS = "@wallet/GET_ACCOUNTS",
  GET_ACCOUNT = "@wallet/GET_ACCOUNT"
}

export interface VaultData {
  id?: string;
  address?: string;
  balance?: number;
  mnemonic?: string;
}

export interface AccountData {
  id?: string;
  publicKey: string;
  privateKey: string;
}

export interface NewWalletData {
  password: string;
  mnemonic: string;
  firstVaultAccount: AccountData;
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
