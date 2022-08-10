import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import { FormInput } from "components/ui/form/inputs/form-input";
import { SecretInput } from "components/ui/form/inputs/secret-input";
import { Form, Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import * as Yup from "yup";

type Props = {
  onSubmit: (values: ImportWithMnemonicParams) => Promise<void>;
};

export const WalletImportMnemonicForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToPreviousPage = () => {
    navigate(-1);
  };

  const handleSubmitForm = async (
    values: ImportWithMnemonicParams,
    actions: FormikHelpers<ImportWithMnemonicParams>
  ) => {
    try {
      await onSubmit(values);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
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
          }}
          validationSchema={Yup.object().shape({
            mnemonic: Yup.string().required(t("required_field")),
            password: Yup.string().required(t("required_field"))
          })}
          onSubmit={handleSubmitForm}
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
                inputProps={{ maxLength: 250 }}
                onChange={handleChange}
                onBlur={handleBlur}
                valueCopy={false}
                multiline
                minRows={3}
              />

              <SecretInput
                id="wallet-password"
                name="password"
                label={t("password")}
                value={values.password}
                error={Boolean(touched.password && errors.password)}
                errorMessage={errors.password}
                inputProps={{ maxLength: 100 }}
                onChange={handleChange}
                onBlur={handleBlur}
                valueCopy={false}
              />

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
                  sx={{ width: { xs: "100%", md: "200px" } }}
                  loadingPosition="center"
                  size="medium"
                  variant="contained"
                  color="info"
                  onClick={goToPreviousPage}
                >
                  {t("form_cancel")}
                </LoadingButton>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default WalletImportMnemonicForm;

export type ImportWithMnemonicParams = {
  mnemonic: string;
  password: string;
};
