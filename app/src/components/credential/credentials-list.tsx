import { List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getCredentials } from "services/solana-web3/getCredentials";
import CredentialCard from "./credential-card";

const CREDENTIALS = [
  { websiteUrl: "github.com", label: "metavault@gmail.com", secret: "teste" },
  { websiteUrl: "github.com", label: "metavaultv2@gmail.com", secret: "teste2" }
];

interface CredentialItem {
  websiteUrl: string;
  label: string;
  secret: string;
}

const CredentialsList = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Array<CredentialItem>>([]);

  useEffect(() => {
    async function getCredentialsList() {
      try {
        setLoading(true);
        const credentials = await getCredentials();
        setList(credentials);
        setLoading(false);
      } catch (err) {}
    }

    getCredentialsList();
  }, []);

  return (
    <List>
      {(loading ? Array.from(new Array(5)) : list).map((item, index) => (
        <ListItem sx={{ display: "block" }} key={index}>
          <CredentialCard dataLoaded={!!item} url={item?.websiteUrl} label={item?.label} secret={item?.secret} />
        </ListItem>
      ))}
    </List>
  );
};

export default CredentialsList;
