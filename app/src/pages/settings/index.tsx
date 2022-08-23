import { Box, Button, Container, styled, Typography, ButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const BASE_PATH = "/settings";

const SettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToSetting = (subpath: string) => {
    navigate({ pathname: `${BASE_PATH}/${subpath}` });
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("settings")}
        </Typography>
      </Box>

      <Box my={4} display="flex" flexDirection="column">
        <SettingButton
          color="info"
          variant="contained"
          size="medium"
          onClick={() => handleGoToSetting("show-mnemonic")}
        >
          {t("show_mnemonic")}
        </SettingButton>
        <SettingButton
          color="info"
          variant="contained"
          size="medium"
          onClick={() => handleGoToSetting("change-language")}
        >
          {t("change_language")}
        </SettingButton>
        <SettingButton
          color="info"
          variant="contained"
          size="medium"
          onClick={() => handleGoToSetting("account")}
        >
          {t("add_account")}
        </SettingButton>
        <SettingButton color="warning" variant="contained" size="medium" onClick={() => ({})}>
          {t("delete_account")}
        </SettingButton>
        <SettingButton color="warning" variant="contained" size="medium" onClick={() => ({})}>
          {t("reset_wallet")}
        </SettingButton>
      </Box>
    </Container>
  );
};

export default SettingsPage;

const SettingButton = styled(Button)<ButtonProps>(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "100%"
  },
  [theme.breakpoints.up("md")]: {
    width: "320px"
  },
  marginBottom: "8px"
}));
