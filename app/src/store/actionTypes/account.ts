export enum AccountActionType {
  GENERATE_ACCOUNTS_LIST = "@account/GENERATE_ACCOUNTS_LIST"
}

interface GenerateAccountsList {
  type: AccountActionType.GENERATE_ACCOUNTS_LIST;
  mnemonic: string;
}

export type AccountAction = GenerateAccountsList;
