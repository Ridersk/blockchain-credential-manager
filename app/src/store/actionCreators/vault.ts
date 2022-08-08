import { createAsyncThunk } from "@reduxjs/toolkit";
import { VaultAccountDetails, VaultActivity } from "scripts/wallet-manager/controllers/vault";
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
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "vault.details"
  });
  result = response?.data;
  if (result.status === "error" || !result?.details) {
    return thunkAPI.rejectWithValue(new VaultAccountRequestError("Error getting details"));
  }

  return result?.details;
});

export const getActivitiesAction = createAsyncThunk<
  VaultActivity[],
  void,
  {
    rejectValue: VaultAccountRequestError;
  }
>(VaultAccountActionType.GET_ACTIVITIES, async (_, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "vault.activities"
  });
  result = response?.data;
  if (result.status === "error" || !result?.activities) {
    return thunkAPI.rejectWithValue(new VaultAccountRequestError("Error getting activities"));
  }

  return result?.activities;
});

export const requestAirdropAction = createAsyncThunk<
  void,
  void,
  {
    rejectValue: VaultAccountRequestError;
  }
>(VaultAccountActionType.REQUEST_AIRDROP, async (_, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "vault.requestAirdrop"
  });
  result = response?.data;

  if (result.status === "error") {
    return thunkAPI.rejectWithValue(new VaultAccountRequestError("Error on request airdrop"));
  }
});
