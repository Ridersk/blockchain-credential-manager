import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
} from "@mui/material";
import AnimateButton from "components/buttons/AnimateButton";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { sendCredential } from "services/sendCredentials";
import { copyTextToClipboard } from "utils/clipboard";

interface FormValues {
  credentialLabel: string;
  credentialSecret: string;
}

const CredentialCreation = () => {
  const [currentTabUsername, setCurrentTabUsername] = useState("");
  const [currentTabPassword, setCurrentTabPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // useEffect(() => {
  //   async function setPageBackgroundColor() {
  //     chrome.storage.sync.set({ color: "#3aa757" }, () => {});
  //     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  //     chrome.scripting.executeScript({
  //       target: { tabId: tab.id },
  //       function: () => {
  //         chrome.storage.sync.get("color", ({ color }) => {
  //           document.body.style.backgroundColor = color;
  //         });
  //       }
  //     });
  //   }

  //   setPageBackgroundColor();
  // }, []);

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

  useEffect(() => {
    async function getUserValue() {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Send a request to the content script to get current tab input value.
      chrome.tabs.sendMessage(tab.id || 0, { action: "getCredentials" }, function (response) {
        // alert("RESPOSTA:", response.data);
        setCurrentTabUsername(response.data.username);
        setCurrentTabPassword(response.data.password);
      });
    }

    getUserValue();
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickCopyInput = (value: string) => {
    console.log("Input VALUE:", value);
    copyTextToClipboard(value);
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
          credentialLabel: currentTabUsername,
          credentialSecret: currentTabPassword,
          submit: null
        }}
        enableReinitialize
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
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy credential label value"
                      onClick={() => {
                        handleClickCopyInput(values.credentialLabel);
                      }}
                      edge="end"
                    >
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                }
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
                type={showPassword ? "text" : "password"}
                value={values.credentialSecret}
                name="credentialSecret"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Segredo"
                inputProps={{}}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton
                      aria-label="copy credential secret value"
                      onClick={() => {
                        handleClickCopyInput(values.credentialSecret);
                      }}
                      edge="end"
                    >
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                }
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
