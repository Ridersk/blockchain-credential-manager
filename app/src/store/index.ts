import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";

// ==============================|| REDUX - MAIN STORE ||============================== //

export const store = createStore(reducers, {}, applyMiddleware(thunk));
