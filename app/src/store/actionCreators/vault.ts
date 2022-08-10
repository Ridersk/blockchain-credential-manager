import { createAsyncThunk } from "@reduxjs/toolkit";
import { VaultAccountDetails, VaultActivity } from "scripts/wallet-manager/controllers/vault";
import { background } from "services/background-connection/background-msg";
import { VaultAccountActionType } from "store/actionTypes/vault";

export class VaultAccountRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const getDetailsAction = createAsyncThunk<
  VaultAccountDetails,
  void,
  {
    rejectValue: VaultAccountRequestError;
  }
>(VaultAccountActionType.GET_DETAILS, async (_, thunkAPI) => {
  const response = await background.getVaultDetails();
  const result = response?.result;
  const status = response?.status;

  if (status === "error" || !result) {
    return thunkAPI.rejectWithValue(new VaultAccountRequestError("Error getting details"));
  }

  return result;
});

export const getActivitiesAction = createAsyncThunk<
  VaultActivity[],
  void,
  {
    rejectValue: VaultAccountRequestError;
  }
>(VaultAccountActionType.GET_ACTIVITIES, async (_, thunkAPI) => {
  const response = await background.getActivities();
  const status = response?.status;
  const result = response?.result;

  if (status === "error" || !result) {
    return thunkAPI.rejectWithValue(new VaultAccountRequestError("Error getting activities"));
  }

  return result;
});

export const requestAirdropAction = createAsyncThunk<
  void,
  void,
  {
    rejectValue: VaultAccountRequestError;
  }
>(VaultAccountActionType.REQUEST_AIRDROP, async (_, thunkAPI) => {
  const response = await background.requestAirdrop();
  const status = response?.status;

  if (status === "error") {
    return thunkAPI.rejectWithValue(new VaultAccountRequestError("Error on request airdrop"));
  }
});
