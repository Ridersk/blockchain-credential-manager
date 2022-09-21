import { Box, Button, Container, styled, Typography, ButtonProps } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import WarningModal from "components/ui/modal/modal-warning";
import useNotification from "hooks/useNotification";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { resetWalletAction, WalletRequestError } from "store/actionCreators";
import Logger from "utils/log";
import { sleep } from "utils/time";

const BASE_PATH = "/settings";

const SettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendNotification = useNotification();
  const dispatch = useTypedDispatch();
  const [modalConfig, setModalConfig] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    requestPassword?: boolean;
    action?: () => Promise<void>;
  }>({
    open: false,
    title: "",
    description: "",
    requestPassword: false,
    action: () => Promise.resolve()
  });

  const handleGoToSetting = (subpath: string) => {
    navigate({ pathname: `${BASE_PATH}/${subpath}` });
  };

  const handleResetWallet = async (password?: string) => {
    try {
      unwrapResult(await dispatch(resetWalletAction(password!)));
      await sleep(100);
      sendNotification({
        message: t("wallet_reseted_successfully"),
        variant: "success"
      });

      window.location.reload();
      navigate({ pathname: "/" });
    } catch (error) {
      Logger.error(error);
      if (error instanceof WalletRequestError) {
        sendNotification({ message: error?.message, variant: "error" });
      } else {
        sendNotification({
          message: t("unexpected_error"),
          variant: "error"
        });
      }
    }
  };

  const handleOpenResetModalWarning = () => {
    setModalConfig({
      open: true,
      title: t("warning_reset_wallet_title"),
      description: t("warning_reset_wallet_description"),
      requestPassword: true,
      action: handleResetWallet
    });
  };

  return (
    <div>
      <WarningModal
        open={modalConfig.open}
        title={modalConfig.title!}
        description={modalConfig.description!}
        requestPassword={modalConfig.requestPassword}
        onCancel={() => setModalConfig({ open: false })}
        onAccept={modalConfig.action!}
      />

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
          <SettingButton
            color="warning"
            variant="contained"
            size="medium"
            onClick={handleOpenResetModalWarning}
          >
            {t("reset_wallet")}
          </SettingButton>
        </Box>
      </Container>
    </div>
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
