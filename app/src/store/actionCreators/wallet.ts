import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { AccountNotFoundError, WalletLockedError, WalletNoKeyringFoundError } from "exceptions";
import { VaultAccount } from "scripts/wallet-manager/controllers/keyring";
import { SelectedAccount } from "scripts/wallet-manager/controllers/preferences";
import { background } from "services/background-connection/background-msg";
import { NewWalletData, WalletActionType, VaultData } from "../actionTypes/wallet";

export const updateWalletAction = (data: VaultData) => ({
  type: WalletActionType.UPDATE_WALLET,
  data
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

export const updateWalletFromBackgroundAction = createAsyncThunk<
  void,
  void,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>(WalletActionType.FORCE_UPDATE, async (_, thunkAPI) => {
  const response = await background.getState();

  const isInitialized = response?.result?.isInitialized;
  const keyring = (response?.result as any).keyring;
  const preferences = (response?.result as any).preferences;
  const selectedAccount: SelectedAccount = preferences?.selectedAccount;

  if (!isInitialized || !selectedAccount) {
    return thunkAPI.rejectWithValue(new WalletNoKeyringFoundError("Wallet not initialized"));
  }

  if (!keyring?.isUnlocked) {
    return thunkAPI.rejectWithValue(new WalletLockedError("Wallet locked"));
  }

  thunkAPI.dispatch(
    updateWalletAction({ id: selectedAccount.id, address: selectedAccount.address })
  );
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
>(WalletActionType.UNLOCK_WALLET, async (password: string, thunkAPI) => {
  const response = await background.unlockWallet(password);
  const isUnlocked = response.result;

  if (isUnlocked) {
    unwrapResult(await thunkAPI.dispatch(updateWalletFromBackgroundAction()));
  }

  return isUnlocked;
});

export const lockWalletAction = createAsyncThunk<
  boolean,
  void,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError;
  }
>(WalletActionType.LOCK_WALLET, async (_, thunkAPI) => {
  const response = await background.lockWallet();
  const isUnlocked = response.result;

  if (isUnlocked) {
    thunkAPI.dispatch(updateWalletAction({ id: "", address: "", balance: 0, mnemonic: "" }));
  }

  return isUnlocked;
});

export const getAccountsAction = createAsyncThunk<
  VaultAccount[],
  void,
  {
    rejectValue: WalletNoKeyringFoundError | WalletLockedError | AccountNotFoundError;
  }
>(WalletActionType.GET_ACCOUNTS, async (_, thunkAPI) => {
  const response = await background.getAccounts();

  if (!response.result) {
    return thunkAPI.rejectWithValue(new AccountNotFoundError("Wallet not initialized"));
  }

  return response.result;
});
