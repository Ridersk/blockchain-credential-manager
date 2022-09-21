import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  EditCredentialParams,
  NewCredentialParams
} from "scripts/wallet-manager/controllers/credentials";
import { CredentialActionType } from "store/actionTypes/credential";
import { Credential } from "models/Credential";
import { background } from "services/background-connection/background-msg";
import Logger from "utils/log";

export class CredentialRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const createCredentialAction = createAsyncThunk<
  void,
  NewCredentialParams,
  {
    rejectValue: CredentialRequestError;
  }
>(CredentialActionType.CREATE, async (data: NewCredentialParams, thunkAPI) => {
  const response = await background.createCredential(data);
  const status = response?.status;
  const errorMessage = response?.error;

  if (status === "error") {
    return thunkAPI.rejectWithValue(new CredentialRequestError(errorMessage));
  }
});

export const editCredentialAction = createAsyncThunk<
  void,
  EditCredentialParams,
  {
    rejectValue: CredentialRequestError;
  }
>(CredentialActionType.EDIT, async (data: EditCredentialParams, thunkAPI) => {
  const response = await background.editCredential(data);
  const status = response?.status;
  const errorMessage = response?.error;

  if (status === "error") {
    return thunkAPI.rejectWithValue(new CredentialRequestError(errorMessage));
  }
});

export const getCredentialAction = createAsyncThunk<
  Credential,
  string,
  {
    rejectValue: CredentialRequestError;
  }
>(CredentialActionType.GET, async (address: string, thunkAPI) => {
  const response = await background.getCredential(address);
  const status = response?.status;
  const credential: Credential = response?.result;
  const errorMessage = response?.error;

  if (status === "error") {
    return thunkAPI.rejectWithValue(new CredentialRequestError(errorMessage));
  }

  return credential;
});

export const getCredentialsAction = createAsyncThunk<Credential[], void>(
  CredentialActionType.GET_LIST,
  async () => {
    let credentials: Credential[] = [];

    try {
      const response = await background.getCredentials();
      credentials = response?.result;
    } catch (error) {
      Logger.error(error);
    }

    return credentials;
  }
);

export const deleteCredentialAction = createAsyncThunk<
  void,
  string,
  {
    rejectValue: CredentialRequestError;
  }
>(CredentialActionType.DELETE, async (address: string, thunkAPI) => {
  const response = await background.deleteCredential(address);
  const status = response?.status;
  const errorMessage = response?.error;

  if (status === "error") {
    return thunkAPI.rejectWithValue(new CredentialRequestError(errorMessage));
  }
});
