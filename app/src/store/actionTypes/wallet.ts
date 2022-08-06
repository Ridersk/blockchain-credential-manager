// action - customization reducer
export enum WalletActionType {
  SET_WALLET = "@customization/SET_WALLET"
}

export interface WalletData {
  id?: string;
  address?: string;
  balance?: number;
}

interface setWallet {
  type: WalletActionType.SET_WALLET;
  data: WalletData;
}

export type WalletAction = setWallet;
