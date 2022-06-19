import { Box, styled } from "@mui/material";
import { SxProps } from "@mui/system";
import { useNavigate } from "react-router-dom";
import WalletOptionButton from "./wallet-option-button";
import getSolanaWorkspace from "services/solana/solanaWeb3";
import requestAirdrop from "services/solana/requestAirdrop";
import useNotification from "hooks/useNotification";
import { useTranslation } from "react-i18next";

const { program, userKeypair } = getSolanaWorkspace();

interface WalletOptionsGroupProps {
  sx?: SxProps;
}

const WalletOptionsGroup = (props: WalletOptionsGroupProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendNotification = useNotification();

  const goToCreateCredentialPage = () => {
    navigate({ pathname: "/credential" });
  };

  const handleRequestAirdrop = async () => {
    try {
      await requestAirdrop(program, userKeypair);
      sendNotification({ message: t("operation_deposit_successfully"), variant: "info" });
      navigate(0);
    } catch (_) {
      sendNotification({ message: t("operation_deposit_error"), variant: "info" });
    }
  };

  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
      }}
    >
      <WalletOptionButton title={t("btn_add_credential")} onClick={goToCreateCredentialPage} />
      <WalletOptionButton title={t("btn_generate_credential")} onClick={() => {}} />
      <WalletOptionButton title={t("btn_deposit")} onClick={handleRequestAirdrop} />
    </Box>
  );
};

export default styled(WalletOptionsGroup)({});
