// action - wallet reducer
export enum WalletActionType {
  UPDATE_WALLET = "@wallet/UPDATE_WALLET"
}

export interface WalletData {
  id?: string;
  address?: string;
  balance?: number;
  mnemonic?: string;
}

interface updateWallet {
  type: WalletActionType.UPDATE_WALLET;
  data: WalletData;
}

export type WalletAction = updateWallet;
