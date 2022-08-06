// action - wallet reducer
export enum WalletActionType {
  UPDATE_WALLET = "@wallet/UPDATE_WALLET",
  FORCE_UPDATE = "@wallet/FORCE_UPDATE",
  UNLOCK_VAULT = "@wallet/UNLOCK_VAULT",
  CREATE_NEW_VAULT = "@wallet/CREATE_NEW_VAULT"
}

export interface WalletData {
  id?: string;
  address?: string;
  balance?: number;
  mnemonic?: string;
}

export interface NewVaultData {
  password: string;
  mnemonic: string;
}

interface UpdateWallet {
  type: WalletActionType.UPDATE_WALLET;
  data: WalletData;
}

interface UnlockVault {
  type: WalletActionType.UNLOCK_VAULT;
  password: string;
}

interface CreateNewVault {
  type: WalletActionType.CREATE_NEW_VAULT;
  data: NewVaultData;
}

export type WalletAction = UpdateWallet | UnlockVault | CreateNewVault;
