import { Box, Container, Typography } from "@mui/material";
import { FormInput } from "components/ui/form/inputs/form-input";
import { useTypedSelector } from "hooks/useTypedSelector";
import { useTranslation } from "react-i18next";

const ShowMnemonicPage = () => {
  const { t } = useTranslation();
  const mnemonic = useTypedSelector((state) => state.wallet.mnemonic);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("show_mnemonic")}
        </Typography>
      </Box>

      <Box my={4}>
        <FormInput
          type="text"
          id="wallet-mnemonic"
          label={t("mnemonic")}
          valueCopy={true}
          multiline
          minRows={3}
          disabled={true}
          value={mnemonic}
          readOnly
        />
      </Box>
    </Container>
  );
};

export default ShowMnemonicPage;
