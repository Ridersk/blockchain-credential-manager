import { combineReducers } from "redux";

// reducer import
import customizationReducer from "./customization";
import walletReducer from "./wallet";

// ==============================|| COMBINE REDUCER ||============================== //

const reducers = combineReducers({
  customization: customizationReducer,
  wallet: walletReducer
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
