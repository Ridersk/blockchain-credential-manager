import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { AccountNotFoundError, WalletLockedError, WalletNoKeyringFoundError } from "exceptions";
import { VaultAccount } from "scripts/wallet-manager/controllers/keyring";
import { SelectedAccount } from "scripts/wallet-manager/controllers/preferences";
import { background } from "services/background-connection/background-msg";
import { NewWalletData, WalletActionType, VaultData, AccountData } from "../actionTypes/wallet";

export const updateWalletAction = (data: VaultData) => ({
  type: WalletActionType.UPDATE_WALLET,
  data
});

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
  const mnemonic = keyring?.keyring?.mnemonic;

  if (!isInitialized || !selectedAccount) {
    return thunkAPI.rejectWithValue(new WalletNoKeyringFoundError("Wallet not initialized"));
  }

  if (!keyring?.isUnlocked) {
    return thunkAPI.rejectWithValue(new WalletLockedError("Wallet locked"));
  }

  thunkAPI.dispatch(
    updateWalletAction({
      id: selectedAccount.id,
      address: selectedAccount.address,
      mnemonic
    })
  );
});

export const forceUpdateWalletAction = createAsyncThunk<void, void>(
  WalletActionType.FORCE_UPDATE,
  async () => {
    await background.fullUpdate();
  }
);

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

export const lockWalletAction = createAsyncThunk<boolean, void>(
  WalletActionType.LOCK_WALLET,
  async (_, thunkAPI) => {
    const response = await background.lockWallet();
    const isUnlocked = response.result;

    if (isUnlocked) {
      thunkAPI.dispatch(updateWalletAction({ id: "", address: "", balance: 0, mnemonic: "" }));
    }

    return isUnlocked;
  }
);

export const addNewAccountAction = createAsyncThunk<
  boolean,
  AccountData,
  {
    rejectValue: WalletRequestError;
  }
>(WalletActionType.ADD_NEW_ACCOUNT, async (account: AccountData, thunkAPI) => {
  const response = await background.addAccount(account);
  const status = response.status;
  const error = response.error;

  if (status === "error") {
    return thunkAPI.rejectWithValue(new WalletRequestError(error));
  }

  return Boolean(unwrapResult(await thunkAPI.dispatch(getAccountAction(account.publicKey))));
});

export const editAccountAction = createAsyncThunk<
  boolean,
  AccountData,
  {
    rejectValue: WalletRequestError;
  }
>(WalletActionType.EDIT_ACCOUNT, async (account: AccountData, thunkAPI) => {
  const response = await background.editAccount(account);
  const status = response.status;
  const error = response.error;

  if (status === "error") {
    return thunkAPI.rejectWithValue(new WalletRequestError(error));
  }

  return Boolean(unwrapResult(await thunkAPI.dispatch(getAccountAction(account.publicKey))));
});

export const deleteAccountAction = createAsyncThunk<
  void,
  string,
  {
    rejectValue: WalletRequestError;
  }
>(WalletActionType.DELETE_ACCOUNT, async (publicKey: string, thunkAPI) => {
  const response = await background.deleteAccount(publicKey);
  const status = response.status;
  const error = response.error;

  if (status === "error") {
    return thunkAPI.rejectWithValue(new WalletRequestError(error));
  }
});

export const getAccountsAction = createAsyncThunk<
  VaultAccount[],
  void,
  {
    rejectValue: AccountNotFoundError;
  }
>(WalletActionType.GET_ACCOUNTS, async (_, thunkAPI) => {
  const response = await background.getAccounts();

  if (!response.result) {
    return thunkAPI.rejectWithValue(new AccountNotFoundError("Wallet not initialized"));
  }

  return response.result;
});

export const getAccountAction = createAsyncThunk<
  VaultAccount,
  string,
  {
    rejectValue: AccountNotFoundError;
  }
>(WalletActionType.GET_ACCOUNT, async (address: string, thunkAPI) => {
  const response = await background.getAccount(address);

  if (!response.result) {
    return thunkAPI.rejectWithValue(new AccountNotFoundError("Account not found"));
  }

  return response.result;
});

export class WalletRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}
