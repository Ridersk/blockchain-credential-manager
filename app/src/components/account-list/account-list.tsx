import { List, ListItem, SxProps } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { useEffect, useState } from "react";
import { generateAccountsListAction, GeneratedAccountDetails } from "store/actionCreators/account";
import Logger from "utils/log";
import AccountCard from "./account-card";

type Props = {
  sx?: SxProps;
  mnemonic: string;
  excludeAccounts?: GeneratedAccountDetails[];
  onSelected?: (account: { publicKey: string; privateKey: string }) => Promise<void>;
};

const AccountList = (props: Props) => {
  const {
    mnemonic,
    excludeAccounts = [],
    onSelected = () => new Promise(() => ({})),
    ...otherProps
  } = props;
  const dispatch = useTypedDispatch();
  const [loading, setLoading] = useState(false);
  const [accountList, setAccountList] = useState<Array<GeneratedAccountDetails>>([]);

  useEffect(() => {
    (async () => {
      try {
        if (mnemonic) {
          setLoading(true);
          const accounts = unwrapResult(await dispatch(generateAccountsListAction(mnemonic)));

          if (excludeAccounts) {
            for (const account of accounts) {
              if (
                excludeAccounts.find(
                  (excludedAccount) => excludedAccount.publicKey === account.publicKey
                )
              ) {
                accounts.splice(accounts.indexOf(account), 1);
              }
            }
          }

          setAccountList(accounts);
        }
      } catch (error) {
        Logger.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [mnemonic]);

  const handleSelect = async (account: {
    index: number;
    publicKey: string;
    privateKey: string;
  }) => {
    await onSelected({
      publicKey: account.publicKey,
      privateKey: account.privateKey
    });
  };

  return (
    <List {...otherProps}>
      {(loading ? Array.from(new Array<GeneratedAccountDetails>(5)) : accountList).map(
        (item, index) => (
          <ListItem sx={{ display: "block", padding: "8px 0px 8px 0px" }} key={index}>
            <AccountCard
              dataLoaded={!!item}
              publicKey={item?.publicKey}
              privateKey={item?.privateKey!}
              balance={item?.balance!}
              onClick={({ publicKey, privateKey }) =>
                handleSelect({ index, publicKey, privateKey })
              }
            />
          </ListItem>
        )
      )}
    </List>
  );
};

export default AccountList;
