import { WalletAction, WalletActionType } from "../actionTypes/wallet";

export interface WalletState {
  id: string;
  address: string;
}

export const initialState = {
  id: "Wallet 1",
  address: "1111111111111"
};

const customizationReducer = (state: WalletState = initialState, action: WalletAction): WalletState => {
  switch (action.type) {
    case WalletActionType.SET_WALLET:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
};

export default customizationReducer;