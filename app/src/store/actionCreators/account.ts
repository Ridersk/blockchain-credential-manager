import { createAsyncThunk } from "@reduxjs/toolkit";
import bs58 from "bs58";
import { AccountActionType } from "store/actionTypes";
import { AccountGenerator } from "utils/account-generator";
import { AccountUtils } from "utils/account-utils";

export const generateAccountsListAction = createAsyncThunk<
  GeneratedAccountDetails[],
  string,
  {
    rejectValue: AccountRequestError;
  }
>(AccountActionType.GENERATE_ACCOUNTS_LIST, async (mnemonic, thunkAPI) => {
  const accountListFormatted = [];
  const mnemonicIsValid = AccountGenerator.validateMnemonic(mnemonic);

  if (!mnemonicIsValid) {
    thunkAPI.rejectWithValue(new AccountRequestError("Invalid mnemonic"));
  }

  const accountUtils = new AccountUtils();
  const accountList = await AccountGenerator.generateAccountList(mnemonic);
  for (let account of accountList) {
    accountListFormatted.push({
      publicKey: account.publicKey.toBase58(),
      privateKey: bs58.encode(account.secretKey),
      balance: await accountUtils.getAccountBalance(account.publicKey.toBase58())
    });
  }

  return accountListFormatted;
});

export class AccountRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type GeneratedAccountDetails = {
  publicKey: string;
  privateKey?: string;
  balance?: number;
};
