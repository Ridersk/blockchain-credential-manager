import { createAsyncThunk } from "@reduxjs/toolkit";
import { WalletDetails, Activity } from "scripts/wallet-manager/controllers/account";
import { AccountActionType } from "store/actionTypes/account";

export class AccountRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const getDetailsAction = createAsyncThunk<
  WalletDetails,
  void,
  {
    rejectValue: AccountRequestError;
  }
>(AccountActionType.GET_DETAILS, async (_, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "account.details"
  });
  result = response?.data;
  if (result.status === "error" || !result?.details) {
    return thunkAPI.rejectWithValue(new AccountRequestError("Error getting details"));
  }

  return result?.details;
});

export const getActivitiesAction = createAsyncThunk<
  Activity[],
  void,
  {
    rejectValue: AccountRequestError;
  }
>(AccountActionType.GET_ACTIVITIES, async (_, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "account.activities"
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
    action: "account.requestAirdrop"
  });
  result = response?.data;

  if (result.status === "error") {
    return thunkAPI.rejectWithValue(new AccountRequestError("Error on request airdrop"));
  }
});
