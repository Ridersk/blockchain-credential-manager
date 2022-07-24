import { List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import CredentialCard from "./credential-card";
import { Credential } from "models/Credential";
import getCredentials from "services/credentials-program/getCredentials";

const CREDENTIALS = [
  { url: "github.com", label: "metavault@gmail.com", secret: "teste" },
  { url: "github.com", label: "metavaultv2@gmail.com", secret: "teste2" }
];

interface Props {
  textFilter?: string;
}

type CredentialAttributes = {
  publicKey: string;
  url: string;
  iconUrl: string;
  label: string;
  secret: string;
};

const CredentialsList = ({ textFilter = "" }: Props) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Array<CredentialAttributes>>([]);

  const filterCredentials = async (credentials: Array<Credential>) => {
    if (textFilter) {
      const searchText = textFilter.toLowerCase();
      return credentials?.filter(
        async (item) =>
          item.title.toLowerCase().includes(searchText) ||
          item.url.toLowerCase().includes(searchText) ||
          (await item.label).toLowerCase().includes(searchText)
      );
    }
    return credentials;
  };

  const formatCredentials = async (
    credentials: Array<Credential>
  ): Promise<CredentialAttributes[]> => {
    return Promise.all(
      credentials.map(async (item) => {
        const label = await item.label;
        const secret = await item.secret;
        return {
          publicKey: item?.publicKey,
          url: item?.url,
          iconUrl: item?.iconUrl,
          label,
          secret
        };
      })
    );
  };

  useEffect(() => {
    async function getCredentialsList() {
      try {
        setLoading(true);
        const credentials = await formatCredentials(
          await filterCredentials(await getCredentials())
        );
        setList(credentials);
        setLoading(false);
      } catch (err) {}
    }

    getCredentialsList();
  }, [textFilter]);

  return (
    <List>
      {(loading ? Array.from(new Array<Credential>(5)) : list).map((item, index) => (
        <ListItem sx={{ display: "block", padding: "8px 0px 8px 0px" }} key={index}>
          <CredentialCard
            dataLoaded={!!item}
            credentialKey={item?.publicKey}
            url={item?.url}
            iconUrl={item?.iconUrl}
            label={item?.label as string}
            secret={item?.secret as string}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default CredentialsList;
