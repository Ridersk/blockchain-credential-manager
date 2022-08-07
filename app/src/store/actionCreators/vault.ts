import { createAsyncThunk } from "@reduxjs/toolkit";
import { VaultAccountDetails, VaultActivity } from "scripts/wallet-manager/controllers/vault";
import { AccountActionType } from "store/actionTypes/account";

export class AccountRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const getDetailsAction = createAsyncThunk<
  VaultAccountDetails,
  void,
  {
    rejectValue: AccountRequestError;
  }
>(AccountActionType.GET_DETAILS, async (_, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "vault.details"
  });
  result = response?.data;
  if (result.status === "error" || !result?.details) {
    return thunkAPI.rejectWithValue(new AccountRequestError("Error getting details"));
  }

  return result?.details;
});

export const getActivitiesAction = createAsyncThunk<
  VaultActivity[],
  void,
  {
    rejectValue: AccountRequestError;
  }
>(AccountActionType.GET_ACTIVITIES, async (_, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "vault.activities"
  });
  result = response?.data;
  if (result.status === "error" || !result?.activities) {
    return thunkAPI.rejectWithValue(new AccountRequestError("Error getting activities"));
  }

  return result?.activities;
});

export const requestAirdropAction = createAsyncThunk<
  void,
  void,
  {
    rejectValue: AccountRequestError;
  }
>(AccountActionType.REQUEST_AIRDROP, async (_, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "vault.requestAirdrop"
  });
  result = response?.data;

  if (result.status === "error") {
    return thunkAPI.rejectWithValue(new AccountRequestError("Error on request airdrop"));
  }
});
