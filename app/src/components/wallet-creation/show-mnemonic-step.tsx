import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { FormInput } from "components/ui/form/inputs/form-input";
import { useTranslation } from "react-i18next";

type Props = {};

const WalletCreationShowMnemonicStep = (props: Props) => {
  const { t } = useTranslation();

  const handleNextStep = (values: object) => {};

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("title_protect_vault")}
        </Typography>
      </Box>

      <FormInput
        type="text"
        id="wallet-mnemonic"
        fieldName="mnemonic"
        label={t("wallet_mnemonic_input")}
        value={"SECRET PHRASE"}
        disabled={true}
      />
    </Container>
  );
};

export default WalletCreationShowMnemonicStep;
