import { combineReducers } from "redux";

// reducer imports
import walletReducer from "./wallet";
import networkReducer from "./network";

// ==============================|| COMBINE REDUCER ||============================== //

const reducers = combineReducers({
  wallet: walletReducer,
  network: networkReducer
});

export default reducers;
