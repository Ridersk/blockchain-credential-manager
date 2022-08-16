import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { WalletLockedError, WalletNoKeyringFoundError } from "exceptions";
import { background } from "services/background-connection/background-msg";
import { NewWalletData, WalletActionType, VaultData } from "../actionTypes/wallet";

export const updateWalletAction = (data: VaultData) => ({
  type: WalletActionType.UPDATE_WALLET,
  data
});

export const updateWalletFromBackgroundAction = createAsyncThunk<
  string,
  void,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>(WalletActionType.FORCE_UPDATE, async (_, thunkAPI) => {
  const response = await background.getState();

  const isInitialized = response?.result?.isInitialized;
  const keyring = (response?.result as any).keyring;
  const preferences = (response?.result as any).preferences;
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

export const forceUpdateWalletAction = createAsyncThunk<
  void,
  void,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>(WalletActionType.FORCE_UPDATE, async () => {
  await background.fullUpdate();
});

export const unlockWalletAction = createAsyncThunk<
  boolean,
  string,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>(WalletActionType.UNLOCK_WALLET, async (password: string, thunkAPI): Promise<boolean> => {
  let isUnlocked = false;

  const response = await background.unlockWallet(password);
  isUnlocked = response.result;

  if (isUnlocked) {
    unwrapResult(await thunkAPI.dispatch(updateWalletFromBackgroundAction()));
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
    await background.registerNewWallet(mnemonic, password, firstVaultAccount);
    return unwrapResult(await thunkAPI.dispatch(unlockWalletAction(password)));
  }
);
