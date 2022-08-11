import { Box, Typography } from "@mui/material";
import { FormInput } from "components/ui/form/inputs/form-input";
import { useTranslation } from "react-i18next";
import { useField } from "formik";

type Props = {
  formField: {
    mnemonicConfirmation: {
      name: string;
      label: string;
    };
  };
};

const WalletConfirmMnemonic = (props: Props) => {
  const { t } = useTranslation();
  const [mnemonicConfirmField, mnemonicConfirmMeta] = useField(
    props.formField.mnemonicConfirmation
  );

  return (
    <Box>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("confirm_mnemonic")}
        </Typography>
      </Box>

      <Box my={4}>
        <Typography variant="h6" component="h6" gutterBottom align="center" color="gray">
          {t("confirm_mnemonic_description")}
        </Typography>
      </Box>

      <Box my={4}>
        <FormInput
          {...mnemonicConfirmField}
          type="text"
          id="wallet-mnemonic"
          label={t(props.formField.mnemonicConfirmation.label)}
          error={Boolean(mnemonicConfirmMeta.touched && mnemonicConfirmMeta.error)}
          errorMessage={t(mnemonicConfirmMeta.error as string)}
          multiline
          minRows={3}
        />
      </Box>
    </Box>
  );
};

export default WalletConfirmMnemonic;
