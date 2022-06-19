import { Container } from "@mui/material";
import CredentialsPanel from "components/credential/credentials-list-panel";
import { useTranslation } from "react-i18next";
import WalletDetailsPanel from "components/wallet/wallet-detais-panel";

const Home = () => {
  const { t } = useTranslation();
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      <WalletDetailsPanel />
      <CredentialsPanel />
    </Container>
  );
};

export default Home;
