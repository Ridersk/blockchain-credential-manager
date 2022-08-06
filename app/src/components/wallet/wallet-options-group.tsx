import { Box, styled } from "@mui/material";
import { SxProps } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
import WalletOptionButton from "./wallet-option-button";
import useNotification from "hooks/useNotification";
import { updateWalletAction } from "store/actionCreators";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { getDetailsAction, requestAirdropAction } from "store/actionCreators/account";

interface WalletOptionsGroupProps {
  sx?: SxProps;
}

const WalletOptionsGroup = (props: WalletOptionsGroupProps) => {
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendNotification = useNotification();

  const goToCreateCredentialPage = () => {
    navigate({ pathname: "/credential" });
  };

  const handleRequestAirdrop = async () => {
    try {
      await dispatch(requestAirdropAction());
      const walletDetails = unwrapResult(await dispatch(getDetailsAction()));
      dispatch(updateWalletAction({ balance: walletDetails.balance }));
      sendNotification({ message: t("operation_deposit_successfully"), variant: "info" });
    } catch (err) {
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
      <WalletOptionButton title={t("btn_add_credential")} onClick={goToCreateCredentialPage} />
      <WalletOptionButton title={t("btn_generate_credential")} onClick={() => {}} />
      <WalletOptionButton title={t("btn_deposit")} onClick={handleRequestAirdrop} />
    </Box>
  );
};

export default styled(WalletOptionsGroup)({});
