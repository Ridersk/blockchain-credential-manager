import { Dispatch } from "redux";
import { WalletActionType, WalletAction, WalletData } from "../actionTypes/wallet";

export const setWallet = (data: WalletData) => {
  return async (dispatch: Dispatch<WalletAction>) => {
    dispatch({
      type: WalletActionType.SET_WALLET,
      data
    });
  };
};
