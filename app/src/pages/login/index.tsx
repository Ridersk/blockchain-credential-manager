import { LoadingButton } from "@mui/lab";
import { Box, Container, Grid, Typography } from "@mui/material";
import { SecretInput } from "components/ui/form/inputs/secret-input";
import { Form, Formik } from "formik";
import useNotification from "hooks/useNotification";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import * as Yup from "yup";

type LoginParams = {
  password: string;
};

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendNotification = useNotification();

  const savePasswordToBackground = async (userPassword: string) => {
    console.log("SEND PASSWORD:", userPassword);
    try {
      const response = await chrome.runtime.sendMessage({
        action: "savePassword",
        data: {
          password: userPassword
        }
      });
      const password = response?.data?.password;
      console.log("SAVED PASSWORD:", password);
      return password;
    } catch (err) {
      console.log("Error on save password:", err);
    }
  };

  const unlockVaultBackgroundAction = async (password: string) => {
    console.log("UNLOCK VAULT:", password);
    try {
      const response = await chrome.runtime.sendMessage({
        action: "unlockVault",
        data: {
          password
        }
      });
      const unlocked = response?.data?.unlocked;
      console.log("UNLOCKED VAULT:", unlocked);
      return unlocked;
    } catch (err) {
      console.log("Error on unlock vault:", err);
    }
  };

  const handleSubmit = async (values: LoginParams) => {
    await (async () => new Promise((resolve) => setTimeout(resolve, 500)))();
    try {
      if (await unlockVaultBackgroundAction(values.password)) {
        await savePasswordToBackground(values.password);
        navigate({ pathname: "/" });
        sendNotification({
          message: t("wallet_login_successfully"),
          variant: "success"
        });
      } else {
        sendNotification({
          message: t("wallet_login_incorrect_password"),
          variant: "error"
        });
      }
    } catch (err) {
      sendNotification({
        message: t("wallet_unexpected_error"),
        variant: "error"
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: "16px" }}>
      <Grid container direction="column" sx={{ minHeight: "100vh" }}>
        <Grid item xs={12} my={4}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            {t("welcome_back")}
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
            initialValues={{ password: "" }}
            validationSchema={Yup.object().shape({
              password: Yup.string().required(t("required_field"))
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, handleBlur, handleChange, isSubmitting, touched, values }) => (
              <Form id="wallet-login">
                <SecretInput
                  id="wallet-password"
                  name="password"
                  label={t("wallet_password")}
                  value={values.password}
                  error={Boolean(touched.password && errors.password)}
                  errorMessage={errors.password}
                  inputProps={{ maxLength: 100 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <LoadingButton
                    type="submit"
                    sx={{ width: { xs: "100%", md: "200px" } }}
                    loadingPosition="center"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    size="medium"
                    variant="contained"
                    color="primary"
                  >
                    {t("btn_login_unlock")}
                  </LoadingButton>
                </Box>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
