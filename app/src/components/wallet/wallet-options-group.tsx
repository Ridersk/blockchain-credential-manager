import { Box, styled } from "@mui/material";
import { SxProps } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import WalletOptionButton from "./wallet-option-button";
import getSolanaWorkspace from "services/solana/solanaWeb3";
import requestAirdrop from "services/solana/requestAirdrop";
import { getWalletDetails } from "services/solana/getWalletDetails";
import useNotification from "hooks/useNotification";
import { WalletActionType } from "store/actionTypes";

const { program, userKeypair } = getSolanaWorkspace();

interface WalletOptionsGroupProps {
  sx?: SxProps;
}

const WalletOptionsGroup = (props: WalletOptionsGroupProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendNotification = useNotification();

  const goToCreateCredentialPage = () => {
    navigate({ pathname: "/credential" });
  };

  const handleRequestAirdrop = async () => {
    try {
      await requestAirdrop(program, userKeypair);
      const walletDetails = await getWalletDetails();
      dispatch({ type: WalletActionType.SET_WALLET, data: { balance: walletDetails.balance } });
      sendNotification({ message: t("operation_deposit_successfully"), variant: "info" });
    } catch (err) {
      sendNotification({ message: t("operation_deposit_error"), variant: "info" });
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
