import { NetworkAction, NetworkActionType, NetworkData } from "store/actionTypes";

export interface NetworkState {
  network: NetworkData;
}

export const initialState = {
  network: {} as NetworkData
};

const networkReducer = (
  state: NetworkState = initialState,
  action: NetworkAction
): NetworkState => {
  switch (action.type) {
    case NetworkActionType.UPDATE:
      return {
        ...state,
        network: action.network
      };
    default:
      return state;
  }
};

export default networkReducer;
