import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { WalletLockedError, WalletNoKeyringFoundError } from "exceptions";
import { NewVaultData, WalletActionType, VaultData } from "../actionTypes/wallet";

export const updateWalletAction = (data: VaultData) => ({
  type: WalletActionType.UPDATE_WALLET,
  data
});

export const forceUpdateWalletAction = createAsyncThunk<
  string,
  void,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
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
    return thunkAPI.rejectWithValue(new WalletNoKeyringFoundError("Wallet not initialized"));
  }

  if (!keyring?.isUnlocked) {
    return thunkAPI.rejectWithValue(new WalletLockedError("Wallet locked"));
  }

  thunkAPI.dispatch(updateWalletAction({ id: "Vault 1", address: selectedAddress }));

  return selectedAddress;
});

export const unlockWalletAction = createAsyncThunk<
  boolean,
  string,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>(WalletActionType.UNLOCK_WALLET, async (password: string, thunkAPI): Promise<boolean> => {
  let isUnlocked = false;
  const response = await chrome.runtime.sendMessage({
    action: "unlockWallet",
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
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>(WalletActionType.CREATE_NEW_VAULT, async ({ mnemonic, password }: NewVaultData, thunkAPI) => {
  await chrome.runtime.sendMessage({
    action: "registerVault",
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
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>(
  WalletActionType.RECOVER_VAULT,
  async ({ mnemonic, password }: NewVaultData, thunkAPI): Promise<boolean> => {
    await chrome.runtime.sendMessage({
      action: "registerVault",
      data: {
        mnemonic,
        password
      }
    });

    return unwrapResult(await thunkAPI.dispatch(unlockWalletAction(password)));
  }
);
