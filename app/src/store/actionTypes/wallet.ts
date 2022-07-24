// action - wallet reducer
export enum WalletActionType {
  SET_WALLET = "@wallet/SET_WALLET"
}

export interface WalletData {
  id?: string;
  address?: string;
  balance?: number;
  mnemonic?: string;
}

interface setWallet {
  type: WalletActionType.SET_WALLET;
  data: WalletData;
}

export type WalletAction = setWallet;
