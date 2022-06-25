import { Box, Container, Tab, Tabs } from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";
import CredentialsPanel from "components/credential/credentials-list-panel";
import WalletDetailsPanel from "components/wallet/wallet-detais-panel";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("vault");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      <WalletDetailsPanel />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            textColor="secondary"
            indicatorColor="secondary"
            sx={{ marginBottom: "16px" }}
          >
            <Tab value="vault" label={t("tab_vault")} />
            <Tab value="activity" label={t("tab_activity")} />
          </Tabs>
          <TabPanel value="vault" sx={{ padding: 0 }}>
            <CredentialsPanel />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default Home;
