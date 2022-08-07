import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { VaultLockedError, VaultNoKeyringFoundError } from "exceptions";
import { NewVaultData, WalletActionType, WalletData } from "../actionTypes/wallet";

export const updateWalletAction = (data: WalletData) => ({
  type: WalletActionType.UPDATE_WALLET,
  data
});

export const forceUpdateWalletAction = createAsyncThunk<
  string,
  void,
  {
    rejectValue: VaultNoKeyringFoundError | VaultLockedError;
  }
>(WalletActionType.FORCE_UPDATE, async (_, thunkAPI) => {
  const response = await chrome.runtime.sendMessage({
    action: "getState"
  });
  const isInitialized = response?.data?.isInitialized;
  const keyring = response?.data?.keyring;
  const preferences = response?.data?.preferences;
  const selectedAddress = preferences?.selectedAddress;

  if (!isInitialized || !selectedAddress) {
    return thunkAPI.rejectWithValue(new VaultNoKeyringFoundError("Vault not initialized"));
  }

  if (!keyring?.isUnlocked) {
    return thunkAPI.rejectWithValue(new VaultLockedError("Vault locked"));
  }

  thunkAPI.dispatch(updateWalletAction({ id: "Wallet 1", address: selectedAddress }));

  return selectedAddress;
});

export const unlockVaultAction = createAsyncThunk<
  boolean,
  string,
  {
    rejectValue: VaultNoKeyringFoundError | VaultLockedError;
  }
>(WalletActionType.UNLOCK_VAULT, async (password: string, thunkAPI): Promise<boolean> => {
  let isUnlocked = false;
  const response = await chrome.runtime.sendMessage({
    action: "unlockVault",
    data: {
      password
    }
  });
  isUnlocked = response?.data?.isUnlocked;

  if (isUnlocked) {
    unwrapResult(await thunkAPI.dispatch(forceUpdateWalletAction()));
  }

  return isUnlocked;
});

export const createNewVaultAction = createAsyncThunk<
  void,
  NewVaultData,
  {
    rejectValue: VaultNoKeyringFoundError | VaultLockedError;
  }
>(WalletActionType.CREATE_NEW_VAULT, async ({ mnemonic, password }: NewVaultData, thunkAPI) => {
  await chrome.runtime.sendMessage({
    action: "registerWallet",
    data: {
      mnemonic,
      password
    }
  });

  unwrapResult(await thunkAPI.dispatch(forceUpdateWalletAction()));
});

export const recoverVaultAction = createAsyncThunk<
  boolean,
  NewVaultData,
  {
    rejectValue: VaultNoKeyringFoundError | VaultLockedError;
  }
>(
  WalletActionType.RECOVER_VAULT,
  async ({ mnemonic, password }: NewVaultData, thunkAPI): Promise<boolean> => {
    await chrome.runtime.sendMessage({
      action: "registerWallet",
      data: {
        mnemonic,
        password
      }
    });

    return unwrapResult(await thunkAPI.dispatch(unlockVaultAction(password)));
  }
);
