import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { sendCredential } from "services/solana-web3/sendCredential";
import { copyTextToClipboard } from "utils/clipboard";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import useNotification from "hooks/useNotification";
import { AnchorError } from "@project-serum/anchor";
import { getCredential } from "services/solana-web3/getCredential";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";

interface FormValues {
  title: string;
  currentPageUrl: string;
  credentialLabel: string;
  credentialSecret: string;
  description: string;
}

const CredentialCreation = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const [initialTitle, setInitialTitle] = useState("");
  const [initialUrl, setInitialUrl] = useState("");
  const [initialLabel, setInitialLabel] = useState("");
  const [initialPassword, setInitialPassword] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const sendNotification = useNotification();

  // Get Data from blockchain to edit existing credential
  useEffect(() => {
    async function getCredentialToEdit() {
      const credPublicKey = searchParams.get("cred");

      if (credPublicKey) {
        const credential = await getCredential(new PublicKey(bs58.decode(credPublicKey)));

        setInitialTitle(credential.title);
        setInitialUrl(credential.url);
        setInitialLabel(credential.label);
        setInitialPassword(credential.secret);
        setInitialDescription(credential.description);
      }
    }

    getCredentialToEdit();
  }, []);

  // Get Data from user current external website page
  useEffect(() => {
    async function getUserValue() {
      if (chrome?.tabs) {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Send a request to the content script to get current tab input value.
        chrome.tabs.sendMessage(tab.id || 0, { action: "getCredentials" }, function (response) {
          setInitialLabel(response.data.label);
          setInitialPassword(response.data.password);
        });
      }
    }

    getUserValue();
  }, []);

  const sendCredentials = async (values: FormValues) => {
    /*
     * Send credentials to blockchain
     */

    try {
      setLoading(true);
      const credentialAccount = await sendCredential({
        title: values.title,
        url: values.currentPageUrl,
        label: values.credentialLabel,
        secret: values.credentialSecret,
        description: values.description
      });
      console.log("Credencial criada:", credentialAccount);
      sendNotification({ message: "Credencial criada com sucesso!", variant: "info" });
      navigate(-1);
    } catch (err) {
      if (err instanceof AnchorError) {
        sendNotification({ message: err?.error?.errorMessage, variant: "error" });
      } else {
        sendNotification({ message: "Erro ao processar requisição.", variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickCopyInput = (value: string) => {
    copyTextToClipboard(value);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Nova Credencial
        </Typography>
      </Box>

      <Formik
        initialValues={{
          title: initialTitle,
          currentPageUrl: initialUrl,
          credentialLabel: initialLabel,
          credentialSecret: initialPassword,
          description: initialDescription,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().max(50).required("Campo obrigatório"),
          currentPageUrl: Yup.string().max(100).required("Campo obrigatório"),
          credentialLabel: Yup.string().max(100).required("Campo obrigatório"),
          credentialSecret: Yup.string().max(100).required("Campo obrigatório"),
          description: Yup.string().max(100)
        })}
        enableReinitialize
        onSubmit={async (values) => {
          await sendCredentials(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FormControl fullWidth error={Boolean(touched.credentialLabel && errors.credentialLabel)}>
              <InputLabel htmlFor="credential-title">Título</InputLabel>
              <OutlinedInput
                id="credential-title"
                type="text"
                value={values.title}
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Título"
                inputProps={{ maxLength: 50 }}
              />
              {touched.title && errors.title && (
                <FormHelperText error id="credential-title-helper">
                  {errors.title}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.credentialLabel && errors.credentialLabel)}
              sx={{
                marginTop: 2
              }}
            >
              <InputLabel htmlFor="credential-url">URL</InputLabel>
              <OutlinedInput
                id="credential-url"
                type="text"
                value={values.currentPageUrl}
                name="currentPageUrl"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{ maxLength: 100 }}
                label="URL"
              />
              {touched.currentPageUrl && errors.currentPageUrl && (
                <FormHelperText error id="credential-url-helper">
                  {errors.currentPageUrl}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.credentialLabel && errors.credentialLabel)}
              sx={{
                marginTop: 2
              }}
            >
              <InputLabel htmlFor="credential-label" variant="outlined">
                Usuário
              </InputLabel>
              <OutlinedInput
                id="credential-label"
                type="text"
                value={values.credentialLabel}
                name="credentialLabel"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{ maxLength: 100 }}
                label="Usuário"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy credential label value"
                      onClick={() => {
                        handleClickCopyInput(values.credentialLabel);
                      }}
                      edge="end"
                    >
                      <ContentCopyIcon />
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

            <FormControl
              fullWidth
              error={Boolean(touched.credentialSecret && errors.credentialSecret)}
              sx={{
                marginTop: 2
              }}
            >
              <InputLabel htmlFor="credential-secret">Senha</InputLabel>
              <OutlinedInput
                id="credential-secret"
                type={showPassword ? "text" : "password"}
                value={values.credentialSecret}
                name="credentialSecret"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{ maxLength: 100 }}
                label="Senha"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                    <IconButton
                      aria-label="copy credential secret value"
                      onClick={() => {
                        handleClickCopyInput(values.credentialSecret);
                      }}
                      edge="end"
                    >
                      <ContentCopyIcon />
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

            <FormControl
              fullWidth
              error={Boolean(touched.credentialLabel && errors.credentialLabel)}
              sx={{
                marginTop: 2
              }}
            >
              <InputLabel htmlFor="credential-notes">Notas</InputLabel>
              <OutlinedInput
                id="credential-notes"
                type="text"
                value={values.description}
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Notas"
                multiline
                maxRows={2}
                inputProps={{ maxLength: 100 }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy notes value"
                      onClick={() => {
                        handleClickCopyInput(values.description);
                      }}
                      edge="end"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.description && errors.description && (
                <FormHelperText error id="credential-notes-helper">
                  {errors.description}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <LoadingButton
                loading={loading}
                loadingPosition="center"
                disabled={isSubmitting}
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Salvar
              </LoadingButton>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default CredentialCreation;
