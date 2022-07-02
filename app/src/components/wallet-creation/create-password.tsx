import { Box, Typography } from "@mui/material";
import { SecretInput } from "components/ui/form/inputs/secret-input";
import { useTranslation } from "react-i18next";
import { useField } from "formik";

type Props = {
  formField: {
    password: { name: string; label: string };
    passwordConfirmation: { name: string; label: string };
  };
};

const WalletCreatePassword = (props: Props) => {
  const { t } = useTranslation();
  const [passwordField, passwordMeta] = useField(props.formField.password);
  const [passwordConfirmField, passwordConfirmMeta] = useField(
    props.formField.passwordConfirmation
  );

  return (
    <Box>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("wallet_create_password")}
        </Typography>
      </Box>

      <Box my={4}>
        <Typography variant="h6" component="h6" gutterBottom align="center" color="gray">
          {t("wallet_password_description")}
        </Typography>
      </Box>

      <Box my={4}>
        <SecretInput
          {...passwordField}
          id="wallet-password"
          name={props.formField.password.name}
          label={t(props.formField.password.label)}
          valueCopy={false}
          error={Boolean(passwordMeta.touched && passwordMeta.error)}
          errorMessage={t(passwordMeta.error as string)}
          placeholder="Create a New Password"
        />

        <SecretInput
          {...passwordConfirmField}
          id="wallet-password-confirmation"
          name={props.formField.passwordConfirmation.name}
          label={t(props.formField.passwordConfirmation.label)}
          error={Boolean(passwordConfirmMeta.touched && passwordConfirmMeta.error)}
          errorMessage={t(passwordConfirmMeta.error as string)}
          inputProps={{ maxLength: 100 }}
          valueCopy={false}
          placeholder="Confirm the password"
        />
      </Box>
    </Box>
  );
};

export default WalletCreatePassword;
