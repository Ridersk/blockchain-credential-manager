import { combineReducers } from "redux";

// reducer import
import customizationReducer from "./customization";

// ==============================|| COMBINE REDUCER ||============================== //

const reducers = combineReducers({
    customization: customizationReducer
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
