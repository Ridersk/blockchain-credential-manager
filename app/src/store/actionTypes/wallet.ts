export enum WalletActionType {
  UPDATE_WALLET = "@wallet/UPDATE_WALLET",
  FORCE_UPDATE = "@wallet/FORCE_UPDATE",
  UNLOCK_WALLET = "@wallet/UNLOCK_WALLET",
  CREATE_NEW_VAULT = "@wallet/CREATE_NEW_VAULT",
  RECOVER_VAULT = "@wallet/RECOVER_VAULT"
}

export interface VaultData {
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
  data: VaultData;
}

interface UnlockWallet {
  type: WalletActionType.UNLOCK_WALLET;
  password: string;
}

interface CreateNewVault {
  type: WalletActionType.CREATE_NEW_VAULT;
  data: NewVaultData;
}

interface RecoverVault {
  type: WalletActionType.RECOVER_VAULT;
  data: NewVaultData;
}

export type WalletAction = UpdateWallet | UnlockWallet | CreateNewVault | RecoverVault;
