import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  EditCredentialParams,
  NewCredentialParams
} from "scripts/wallet-manager/controllers/credentials";
import { CredentialActionType } from "store/actionTypes/credential";
import { Credential } from "models/Credential";

type CredentialRequestResult = {
  status: "success" | "error";
  errorMessage?: string;
};

export class CredentialRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const createCredentialAction = createAsyncThunk<
  CredentialRequestResult,
  NewCredentialParams,
  {
    rejectValue: CredentialRequestError;
  }
>(CredentialActionType.CREATE, async (data: NewCredentialParams, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "credentials.create",
    data
  });
  result = response?.data;

  if (result.status === "error") {
    return thunkAPI.rejectWithValue(new CredentialRequestError(result.errorMessage));
  }

  return result;
});

export const editCredentialAction = createAsyncThunk<
  CredentialRequestResult,
  EditCredentialParams,
  {
    rejectValue: CredentialRequestError;
  }
>(CredentialActionType.EDIT, async (data: EditCredentialParams, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "credentials.edit",
    data
  });
  result = response?.data;
  if (result.status === "error") {
    return thunkAPI.rejectWithValue(new CredentialRequestError(result.errorMessage));
  }

  return result;
});

export const getCredentialAction = createAsyncThunk<Credential, string>(
  CredentialActionType.GET,
  async (address: string) => {
    let credential = null;
    const response = await chrome.runtime.sendMessage({
      action: "credentials.get",
      data: {
        address
      }
    });
    credential = response?.data?.credential;

    return credential;
  }
);

export const getCredentialsAction = createAsyncThunk<Credential[], void>(
  CredentialActionType.GET_LIST,
  async () => {
    let credentials = [];
    const response = await chrome.runtime.sendMessage({
      action: "credentials.getList"
    });
    credentials = response?.data?.credentials;

    return credentials;
  }
);

export const deleteCredentialAction = createAsyncThunk<
  CredentialRequestResult,
  string,
  {
    rejectValue: CredentialRequestError;
  }
>(CredentialActionType.DELETE, async (address: string, thunkAPI) => {
  let result = null;
  const response = await chrome.runtime.sendMessage({
    action: "credentials.delete",
    data: {
      address
    }
  });
  result = response?.data;
  if (result.status === "error") {
    return thunkAPI.rejectWithValue(new CredentialRequestError(result.errorMessage));
  }

  return result;
});
