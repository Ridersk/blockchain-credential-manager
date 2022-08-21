import { List, ListItem } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { useEffect, useState } from "react";
import { generateAccountsListAction, GeneratedAccountDetails } from "store/actionCreators/account";
import AccountCard from "./account-card";

type Props = {
  mnemonic: string;
  onSelected?: (account: { id: string; publicKey: string; privateKey: string }) => Promise<void>;
};

const AccountList = ({ mnemonic, onSelected = () => new Promise(() => ({})) }: Props) => {
  const dispatch = useTypedDispatch();
  const [loading, setLoading] = useState(false);
  const [accountList, setAccountList] = useState<Array<GeneratedAccountDetails>>([]);

  useEffect(() => {
    (async () => {
      try {
        if (mnemonic) {
          setLoading(true);
          const accounts = unwrapResult(await dispatch(generateAccountsListAction(mnemonic)));
          setAccountList(accounts);
        }
      } catch (err) {
        console.error(err);
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
      id: `Vault ${account.index + 1}`,
      publicKey: account.publicKey,
      privateKey: account.privateKey
    });
  };

  return (
    <List>
      {(loading ? Array.from(new Array<GeneratedAccountDetails>(5)) : accountList).map(
        (item, index) => (
          <ListItem sx={{ display: "block", padding: "8px 0px 8px 0px" }} key={index}>
            <AccountCard
              dataLoaded={!!item}
              publicKey={item?.publicKey}
              privateKey={item?.privateKey}
              balance={item?.balance}
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
