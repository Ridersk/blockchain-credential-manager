import { WalletActionType, WalletData } from "../actionTypes/wallet";

export const setWallet = (data: WalletData) => ({
  type: WalletActionType.SET_WALLET,
  data
});
