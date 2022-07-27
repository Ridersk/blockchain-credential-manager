import { WalletActionType, WalletData } from "../actionTypes/wallet";

export const updateWallet = (data: WalletData) => ({
  type: WalletActionType.UPDATE_WALLET,
  data
});
