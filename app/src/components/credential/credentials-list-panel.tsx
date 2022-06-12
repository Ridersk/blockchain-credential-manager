import { Container, TextField } from "@mui/material";
import CredentialsList from "components/credential/credentials-list";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const CredentialsPanel = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");

  const handleCredentialsSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const debouncedChangeHandler = useMemo(() => debounce(handleCredentialsSearch, 300), []);

  return (
    <Container>
      <TextField id="credentials-search" label={t("search_credentials")} variant="outlined" fullWidth onChange={debouncedChangeHandler} />
      <CredentialsList textFilter={searchText} />
    </Container>
  );
};

export default CredentialsPanel;
