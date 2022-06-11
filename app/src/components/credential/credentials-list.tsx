import { List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getCredentials } from "services/solana-web3/getCredentials";
import CredentialCard from "./credential-card";

const CREDENTIALS = [
  { url: "github.com", label: "metavault@gmail.com", secret: "teste" },
  { url: "github.com", label: "metavaultv2@gmail.com", secret: "teste2" }
];

interface CredentialItem {
  title: string;
  url: string;
  label: string;
  secret: string;
}

interface Props {
  textFilter?: string;
}

const CredentialsList = ({ textFilter = "" }: Props) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Array<CredentialItem>>([]);

  const filterCredentials = (credentials: Array<CredentialItem>) => {
    if (textFilter) {
      const searchText = textFilter.toLowerCase();
      return credentials?.filter(
        (item) =>
          item.title.toLowerCase().includes(searchText) ||
          item.url.toLowerCase().includes(searchText) ||
          item.label.toLowerCase().includes(searchText)
      );
    }
    return credentials;
  };

  useEffect(() => {
    async function getCredentialsList() {
      try {
        setLoading(true);
        const credentials = filterCredentials(await getCredentials());
        setList(credentials);
        setLoading(false);
      } catch (err) {}
    }

    getCredentialsList();
  }, [textFilter]);

  return (
    <List>
      {(loading ? Array.from(new Array(5)) : list).map((item, index) => (
        <ListItem sx={{ display: "block", padding: "8px 0px 8px 0px" }} key={index}>
          <CredentialCard dataLoaded={!!item} url={item?.url} label={item?.label} secret={item?.secret} />
        </ListItem>
      ))}
    </List>
  );
};

export default CredentialsList;