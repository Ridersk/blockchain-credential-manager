import { List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import CredentialCard from "./credential-card";
import { Credential } from "models/Credential";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { getCredentialsAction } from "store/actionCreators/credential";
import { unwrapResult } from "@reduxjs/toolkit";
import { filterCredentialsByText } from "utils/credential-filters";

interface Props {
  textFilter?: string;
}

type CredentialAttributes = {
  address: string;
  url: string;
  label: string;
  secret: string;
};

const CredentialsList = ({ textFilter = "" }: Props) => {
  const dispatch = useTypedDispatch();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Array<CredentialAttributes>>([]);

  const formatCredentials = (credentials: Array<Credential>): CredentialAttributes[] => {
    return credentials.map((item) => ({
      address: item?.address,
      url: item?.url,
      label: item?.label,
      secret: item?.secret
    }));
  };

  useEffect(() => {
    async function getCredentialsList() {
      try {
        setLoading(true);
        const credentials = unwrapResult(await dispatch(getCredentialsAction()));
        const credentialsFormatted = formatCredentials(
          filterCredentialsByText(credentials, textFilter)
        );
        setList(credentialsFormatted);
        setLoading(false);
      } catch (error) {}
    }

    getCredentialsList();
  }, [textFilter]);

  return (
    <List>
      {(loading ? Array.from(new Array<Credential>(5)) : list).map((item, index) => (
        <ListItem sx={{ display: "block", padding: "8px 0px 8px 0px" }} key={index}>
          <CredentialCard
            dataLoaded={!!item}
            credentialKey={item?.address}
            url={item?.url}
            label={item?.label}
            secret={item?.secret}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default CredentialsList;
