import { Box, Typography } from "@mui/material";
import { FormInput } from "components/ui/form/inputs/form-input";
import { useField } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AccountGenerator } from "services/account-generator";

type Props = {
  formField: {
    mnemonic: {
      name: string;
      label: string;
    };
  };
  onPhraseGenerated: (field: string, value: any) => void;
};

const WalletShowMnemonic = (props: Props) => {
  const { t } = useTranslation();
  const [mnemonicField, mnemonicMeta] = useField(props.formField.mnemonic);

  useEffect(() => {
    (() =>
      props.onPhraseGenerated(
        props.formField.mnemonic.name,
        AccountGenerator.generateMnemonic()
      ))();
  }, []);

  return (
    <Box>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("recover_vault")}
        </Typography>
      </Box>

      <Box my={4}>
        <Typography variant="h6" component="h6" gutterBottom align="center" color="gray">
          {t("mnemonic_description")}
        </Typography>
      </Box>
      <Box my={4}>
        <FormInput
          {...mnemonicField}
          type="text"
          id="wallet-mnemonic"
          label={t(props.formField.mnemonic.label)}
          error={Boolean(mnemonicMeta.touched && mnemonicMeta.error)}
          errorMessage={t(mnemonicMeta.error as string)}
          valueCopy={true}
          multiline
          minRows={3}
          disabled={true}
          readOnly
        />
      </Box>
    </Box>
  );
};

export default WalletShowMnemonic;
