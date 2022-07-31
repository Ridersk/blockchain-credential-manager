import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  EditCredentialParams,
  NewCredentialParams
} from "scripts/wallet-manager/controllers/credentials";
import { CredentialActionType } from "store/actionTypes/credential";
import { Credential } from "models/Credential";

export const createCredentialAction = createAsyncThunk<Credential, NewCredentialParams>(
  CredentialActionType.CREATE,
  async (data: NewCredentialParams) => {
    let credential = null;
    try {
      const response = await chrome.runtime.sendMessage({
        action: "createCredential",
        data
      });
      credential = response?.data?.credential;
    } catch (err) {
      console.log(`${CredentialActionType.CREATE}`, err);
    }

    return credential;
  }
);

export const editCredentialAction = createAsyncThunk<Credential, EditCredentialParams>(
  CredentialActionType.EDIT,
  async (data: EditCredentialParams) => {
    let credential = null;
    try {
      const response = await chrome.runtime.sendMessage({
        action: "editCredential",
        data
      });
      credential = response?.data?.credential;
    } catch (err) {
      console.log(`${CredentialActionType.EDIT}`, err);
    }

    return credential;
  }
);

export const getCredentialAction = createAsyncThunk<Credential, string>(
  CredentialActionType.GET,
  async (address: string) => {
    let credential = null;
    try {
      const response = await chrome.runtime.sendMessage({
        action: "getCredential",
        data: {
          address
        }
      });
      credential = response?.data?.credential;
    } catch (err) {
      console.log(`${CredentialActionType.GET}`, err);
    }

    return credential;
  }
);

export const getCredentialsAction = createAsyncThunk<Credential[], void>(
  CredentialActionType.GET_LIST,
  async () => {
    let credentials = [];
    try {
      const response = await chrome.runtime.sendMessage({
        action: "getCredentials"
      });
      credentials = response?.data?.credentials;
    } catch (err) {
      console.log(`${CredentialActionType.GET_LIST}`, err);
    }

    return credentials;
  }
);

export const deleteCredentialAction = createAsyncThunk<boolean, string>(
  CredentialActionType.DELETE,
  async (address: string) => {
    let deleted = false;
    try {
      const response = await chrome.runtime.sendMessage({
        action: "deleteCredential",
        data: {
          address
        }
      });
      deleted = response?.data?.deleted;
    } catch (err) {
      console.log(`${CredentialActionType.DELETE}`, err);
    }

    return deleted;
  }
);
