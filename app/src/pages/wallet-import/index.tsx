import { LoadingButton } from "@mui/lab";
import { Container, Grid, Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { FormInput } from "components/ui/form/inputs/form-input";
import { SecretInput } from "components/ui/form/inputs/secret-input";
import { Form, Formik, FormikHelpers } from "formik";
import useNotification from "hooks/useNotification";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { recoverVaultAction } from "store/actionCreators/wallet";
import * as Yup from "yup";

type ImportWithMnemonicParams = {
  mnemonic: string;
  password: string;
  // passwordConfirmation: string;
};

const WalletImportPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const sendNotification = useNotification();

  const handleSubmit = async (
    values: ImportWithMnemonicParams,
    actions: FormikHelpers<ImportWithMnemonicParams>
  ) => {
    try {
      unwrapResult(
        await dispatch(
          recoverVaultAction({
            mnemonic: values.mnemonic,
            password: values.password
          })
        )
      );
      sendNotification({
        message: t("wallet_import_success"),
        variant: "success"
      });
      navigate({ pathname: "/" });
    } catch (err) {
      sendNotification({
        message: t("unexpected_error"),
        variant: "error"
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: "16px" }}>
      <Grid container direction="column" sx={{ minHeight: "100vh" }}>
        <Grid
          item
          xs={12}
          my={4}
          sx={{
            width: "inherit"
          }}
        >
          <Typography variant="h4" component="h3" gutterBottom align="center">
            {t("import_with_mnemonic")}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            flex: "1 !important",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Formik
            initialValues={{
              mnemonic: "",
              password: ""
              // passwordConfirmation: ""
            }}
            validationSchema={Yup.object().shape({
              mnemonic: Yup.string().required(t("required_field")),
              password: Yup.string().required(t("required_field"))
              // passwordConfirmation: Yup.string().required(t("required_field"))
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, handleBlur, handleChange, isSubmitting, touched, values }) => (
              <Form id="form-wallet-import-mnemonic">
                <FormInput
                  type="text"
                  id="wallet-mnemonic"
                  name="mnemonic"
                  label={t("mnemonic")}
                  value={values.mnemonic}
                  error={Boolean(touched.mnemonic && errors.mnemonic)}
                  errorMessage={errors.mnemonic}
                  inputProps={{ maxLength: 100 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valueCopy={false}
                  multiline
                  minRows={3}
                />

                <SecretInput
                  id="wallet-password"
                  name="password"
                  label={t("new_password")}
                  value={values.password}
                  error={Boolean(touched.password && errors.password)}
                  errorMessage={errors.password}
                  inputProps={{ maxLength: 100 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valueCopy={false}
                />

                {/* <SecretInput
                  id="wallet-password-confirmation"
                  name="passwordConfirmation"
                  label={t("confirm_password")}
                  value={values.passwordConfirmation}
                  error={Boolean(touched.passwordConfirmation && errors.passwordConfirmation)}
                  errorMessage={errors.passwordConfirmation}
                  inputProps={{ maxLength: 100 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valueCopy={false}
                /> */}

                <Grid container justifyContent="center" mt={2}>
                  <LoadingButton
                    type="submit"
                    sx={{ width: { xs: "100%", md: "200px" } }}
                    loadingPosition="center"
                    loading={isSubmitting}
                    size="medium"
                    variant="contained"
                    color="primary"
                    onClick={() => ({})}
                  >
                    {t("btn_import_submit")}
                  </LoadingButton>
                  <LoadingButton
                    type="submit"
                    sx={{ width: { xs: "100%", md: "200px" } }}
                    loadingPosition="center"
                    size="medium"
                    variant="contained"
                    color="secondary"
                    onClick={() => ({})}
                  >
                    {t("btn_import_private_key_redirect")}
                  </LoadingButton>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WalletImportPage;
