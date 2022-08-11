import { WalletAction, WalletActionType } from "../actionTypes/wallet";

export interface WalletState {
  id: string;
  address: string;
  balance: number;
  mnemonic: string;
}

export const initialState = {
  id: "Vault 0",
  address: "",
  mnemonic: "",
  balance: 0
};

const customizationReducer = (
  state: WalletState = initialState,
  action: WalletAction
): WalletState => {
  switch (action.type) {
    case WalletActionType.UPDATE_WALLET:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
};

export default customizationReducer;
