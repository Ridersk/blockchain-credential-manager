import { Box, Container, Tab, Tabs } from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";
import CredentialsPanel from "components/credential/credentials-list-panel";
import WalletDetailsPanel from "components/wallet/wallet-detais-panel";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityPanel } from "components/activity/activity-panel";

const Home = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("vault");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ textAlign: "center", minHeight: "100%", display: "flex", flexDirection: "column" }}
    >
      <WalletDetailsPanel />
      <Box
        sx={{
          width: "100%",
          typography: "body1",
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
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
          <TabPanel value="vault" sx={{ padding: 0, flex: 1 }}>
            <CredentialsPanel />
          </TabPanel>
          <TabPanel
            value="activity"
            sx={{ padding: 0, flex: 1, display: "flex", flexDirection: "column" }}
          >
            <ActivityPanel />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default Home;
