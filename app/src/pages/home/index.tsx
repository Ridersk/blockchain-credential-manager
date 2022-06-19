import { Container } from "@mui/material";
import CredentialsPanel from "components/credential/credentials-list-panel";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WalletDetailsPanel from "components/wallet/wallet-detais-panel";

const Home = () => {
  const { t } = useTranslation();
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      <WalletDetailsPanel />
      <Link to={{ pathname: "/credential" }}>{t("create_credential")}</Link>
      <CredentialsPanel />
    </Container>
  );
};

export default Home;
