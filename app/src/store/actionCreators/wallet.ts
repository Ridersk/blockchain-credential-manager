import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { WalletLockedError, WalletNoKeyringFoundError } from "exceptions";
import { NewWalletData, WalletActionType, VaultData } from "../actionTypes/wallet";

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
    action: "wallet.getState"
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
    action: "wallet.unlockWallet",
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

export const createNewWalletAction = createAsyncThunk<
  boolean,
  NewWalletData,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>(
  WalletActionType.CREATE_NEW_WALLET,
  async ({ mnemonic, password, firstVaultAccount }: NewWalletData, thunkAPI) => {
    await chrome.runtime.sendMessage({
      action: "wallet.registerWallet",
      data: {
        mnemonic,
        password,
        firstVaultAccount
      }
    });

    return unwrapResult(await thunkAPI.dispatch(unlockWalletAction(password)));
  }
);
