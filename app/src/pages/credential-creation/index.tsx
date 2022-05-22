import { Box, Button, Container, FormControl, FormHelperText, InputLabel, OutlinedInput, Typography } from "@mui/material";
import AnimateButton from "components/buttons/AnimateButton";
import { Formik } from "formik";
import { sendCredential } from "services/sendCredentials";

interface FormValues {
  credentialLabel: string;
  credentialSecret: string;
}

const CredentialCreation = () => {
  const sendCredentials = async (values: FormValues) => {
    const title = "Credencial de teste";
    const label = values.credentialLabel;
    const labelPath = '//*[@id="login_field"]';
    const secret = values.credentialSecret;
    const secretPath = '//*[@type="password"]';
    const websiteUrl = "https://teste.com";

    // Send credentials to blockchain
    console.log("Enviando...", JSON.stringify(values));

    const credentialAccount = await sendCredential({ title, label, labelPath, secret, secretPath, websiteUrl });

    console.log("Credencial criada:", credentialAccount);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Criar nova credencial
        </Typography>
      </Box>

      <Formik
        initialValues={{
          credentialLabel: "",
          credentialSecret: "",
          submit: null
        }}
        onSubmit={async (values) => {
          await sendCredentials(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FormControl fullWidth error={Boolean(touched.credentialLabel && errors.credentialLabel)}>
              <InputLabel htmlFor="credential-label">Rótulo</InputLabel>
              <OutlinedInput
                id="credential-label"
                type="text"
                value={values.credentialLabel}
                name="credentialLabel"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Rótulo"
                inputProps={{}}
              />
              {touched.credentialLabel && errors.credentialLabel && (
                <FormHelperText error id="credential-label-helper">
                  {errors.credentialLabel}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.credentialSecret && errors.credentialSecret)}>
              <InputLabel htmlFor="credential-secret">Segredo</InputLabel>
              <OutlinedInput
                id="credential-secret"
                type="text"
                value={values.credentialSecret}
                name="credentialSecret"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Segredo"
                inputProps={{}}
              />
              {touched.credentialSecret && errors.credentialSecret && (
                <FormHelperText error id="credential-secret-helper">
                  {errors.credentialSecret}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Salvar
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default CredentialCreation;
