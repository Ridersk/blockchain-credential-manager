import { combineReducers } from "redux";

// reducer imports
import walletReducer from "./wallet";

// ==============================|| COMBINE REDUCER ||============================== //

const reducers = combineReducers({
  wallet: walletReducer
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
