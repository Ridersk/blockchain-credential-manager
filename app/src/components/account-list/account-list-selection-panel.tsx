import { Container, Grid, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBack from "@mui/icons-material/ArrowBackIos";
import AccountList from "./account-list";

type Props = {
  mnemonic: string;
  onSelected?: (account: { publicKey: string; privateKey: string }) => Promise<void>;
  onCancel?: () => void;
};

const AccountListSelectionPanel = ({
  mnemonic,
  onSelected = () => new Promise(() => ({})),
  onCancel = () => ({})
}: Props) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Grid container>
        <Grid item xs={2}>
          <IconButton color="inherit" onClick={onCancel}>
            <ArrowBack fontSize="small" />
          </IconButton>
        </Grid>
        <Grid item xs={8}>
          <Typography component="h6" variant="h6">
            {t("generated_account_list_title")}
          </Typography>
        </Grid>
      </Grid>
      <AccountList mnemonic={mnemonic} onSelected={onSelected} />
    </Container>
  );
};

export default AccountListSelectionPanel;
