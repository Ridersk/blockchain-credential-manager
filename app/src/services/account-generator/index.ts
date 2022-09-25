import bs58 from "bs58";
import { AccountGenerator } from "./account-generator";

export * from "./account-generator";

export const generateAccountsList = async (mnemonic: string) => {
  const accountListFormatted = [];
  const mnemonicIsValid = AccountGenerator.validateMnemonic(mnemonic);

  if (!mnemonicIsValid) {
    throw new AccountRequestError("Invalid mnemonic");
  }

  const accountList = await AccountGenerator.generateAccountList(mnemonic);
  for (let account of accountList) {
    accountListFormatted.push({
      publicKey: account.publicKey.toBase58(),
      privateKey: bs58.encode(account.secretKey),
      balance: 0
    });
  }

  return accountListFormatted;
};

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
