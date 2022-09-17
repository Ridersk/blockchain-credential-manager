import { Box, styled } from "@mui/material";
import { SxProps } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
import VaultAccountOptionButton from "./vault-account-option-button";
import useNotification from "hooks/useNotification";
import { updateWalletAction } from "store/actionCreators";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { getDetailsAction, requestAirdropAction } from "store/actionCreators/vault";

interface VaultAccountOptionsGroupProps {
  sx?: SxProps;
}

const VaultAccountOptionsGroup = (props: VaultAccountOptionsGroupProps) => {
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendNotification = useNotification();

  const goToCreateCredentialPage = () => {
    navigate({ pathname: "/credential" });
  };

  const goToCreateCredentialGeneratorPage = () => {
    navigate({ pathname: "/generate" });
  };

  const handleRequestAirdrop = async () => {
    try {
      await dispatch(requestAirdropAction());
      const vaultAccountDetails = unwrapResult(await dispatch(getDetailsAction()));
      dispatch(updateWalletAction({ balance: vaultAccountDetails.balance }));
      sendNotification({ message: t("operation_deposit_successfully"), variant: "info" });
    } catch (error) {
      sendNotification({ message: t("operation_deposit_error"), variant: "error" });
    }
  };

  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: { xs: "space-between", sm: "center" }
      }}
    >
      <VaultAccountOptionButton
        title={t("btn_add_credential")}
        onClick={goToCreateCredentialPage}
      />
      <VaultAccountOptionButton
        title={t("btn_generate_credential")}
        onClick={goToCreateCredentialGeneratorPage}
      />
      <VaultAccountOptionButton title={t("btn_deposit")} onClick={handleRequestAirdrop} />
    </Box>
  );
};

export default styled(VaultAccountOptionsGroup)({});
