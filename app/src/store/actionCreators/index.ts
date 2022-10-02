import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { WalletLockedError, WalletNoKeyringFoundError } from "exceptions";
import { updateNetworkFromBackgroundAction } from "./network";
import { updateWalletFromBackgroundAction } from "./wallet";

export * from "./credential";
export * from "./network";
export * from "./vault";
export * from "./wallet";

export const updateAppStateFromBackgroundAction = createAsyncThunk<
  void,
  void,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>("@APP/FORCE_UPDATE", async (_, thunkAPI) => {
  unwrapResult(await thunkAPI.dispatch(updateWalletFromBackgroundAction()));
  unwrapResult(await thunkAPI.dispatch(updateNetworkFromBackgroundAction()));
});
