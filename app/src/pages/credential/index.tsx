import { Box, Container, FormHelperText, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnchorError } from "@project-serum/anchor";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { useTranslation } from "react-i18next";
import useNotification from "hooks/useNotification";
import createCredential from "services/credentials-program/createCredential";
import editCredential from "services/credentials-program/editCredential";
import deleteCredential from "services/credentials-program/deleteCredential";
import getCredential from "services/credentials-program/getCredential";
import CredentialDeletionWarningModal from "components/credential/credential-warning-delete";
import { formatHomeUrl } from "utils/url";
import { SecretInput } from "components/ui/form/inputs/secret-input";
import { FormInput } from "components/ui/form/inputs/form-input";

interface FormValues {
  title: string;
  currentPageUrl: string;
  credentialLabel: string;
  credentialSecret: string;
  description: string;
}

const CredentialPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const [credentialPubKey, setCredentialPubKey] = useState<anchor.web3.PublicKey>();
  const [uid, setUid] = useState<number>();
  const [initialTitle, setInitialTitle] = useState("");
  const [initialUrl, setInitialUrl] = useState("");
  const [initialLabel, setInitialLabel] = useState("");
  const [initialPassword, setInitialPassword] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const sendNotification = useNotification();
  const [modalOpen, setModalOpen] = useState(false);

  // Get Data from blockchain to edit existing credential
  useEffect(() => {
    async function getCredentialToEdit() {
      const credPublicKey = searchParams.get("cred");

      if (credPublicKey) {
        const publicKey = new PublicKey(bs58.decode(credPublicKey));
        const credential = await getCredential(publicKey);

        setCredentialPubKey(publicKey);
        setUid(credential.uid);
        setInitialTitle(credential.title);
        setInitialUrl(credential.url);
        setInitialLabel(credential.label);
        setInitialPassword(credential.secret);
        setInitialDescription(credential.description);
        setIsUpdate(true);
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
          setInitialTitle(formatHomeUrl(tab.url || ""));
          setInitialUrl(formatHomeUrl(tab.url || ""));
          setFaviconUrl(tab.favIconUrl || "");
          setInitialLabel(response.data.label);
          setInitialPassword(response.data.password);
        });
      }
    }

    getUserValue();
  }, []);

  const goToPreviousPage = () => {
    navigate(-1);
  };

  const handleSaveCredential = async (values: FormValues) => {
    /*
     * Send credentials to blockchain
     */

    try {
      setLoading(true);
      if (isUpdate && credentialPubKey && uid) {
        await editCredential({
          credentialPubKey: credentialPubKey,
          uid: uid,
          title: values.title,
          url: values.currentPageUrl,
          iconUrl: faviconUrl,
          label: values.credentialLabel,
          secret: values.credentialSecret,
          description: values.description
        });
        sendNotification({
          message: t("operation_credential_edited_successfully"),
          variant: "info"
        });
      } else {
        await createCredential({
          title: values.title,
          url: values.currentPageUrl,
          iconUrl: faviconUrl,
          label: values.credentialLabel,
          secret: values.credentialSecret,
          description: values.description
        });
        sendNotification({
          message: t("operation_credential_created_successfully"),
          variant: "info"
        });
      }
      goToPreviousPage();
    } catch (err) {
      if (err instanceof AnchorError) {
        sendNotification({ message: err?.error?.errorMessage, variant: "error" });
      } else {
        sendNotification({ message: t("operation_unknown_error"), variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredential = async () => {
    try {
      if (isUpdate && credentialPubKey && uid) {
        await deleteCredential({ credentialPubKey: credentialPubKey });
        sendNotification({
          message: t("operation_credential_deleted_successfully"),
          variant: "info"
        });
      }
      goToPreviousPage();
    } catch (err) {
      if (err instanceof AnchorError) {
        sendNotification({ message: err?.error?.errorMessage, variant: "error" });
      } else {
        sendNotification({ message: t("operation_unknown_error"), variant: "error" });
      }
    }
  };

  const handleDeleteCredentialRequest = async () => {
    setModalOpen(true);
  };

  return (
    <div>
      <CredentialDeletionWarningModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onAccept={handleDeleteCredential}
      />

      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {isUpdate ? t("edit_credential") : t("new_credential")}
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
            title: Yup.string().max(50).required(t("required_field")),
            currentPageUrl: Yup.string().max(100).required(t("required_field")),
            credentialLabel: Yup.string().max(100).required(t("required_field")),
            credentialSecret: Yup.string().max(100).required(t("required_field")),
            description: Yup.string().max(100)
          })}
          enableReinitialize
          onSubmit={async (values) => {
            await handleSaveCredential(values);
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <FormInput
                type="text"
                id="credential-title"
                fieldName="title"
                label={t("credential_form_title")}
                value={values.title}
                error={Boolean(touched.title && errors.title)}
                errorMessage={errors.title}
                inputProps={{ maxLength: 50 }}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <FormInput
                type="text"
                id="credential-url"
                fieldName="currentPageUrl"
                label={t("credential_form_url")}
                value={values.currentPageUrl}
                error={Boolean(touched.currentPageUrl && errors.currentPageUrl)}
                errorMessage={errors.currentPageUrl}
                inputProps={{ maxLength: 100 }}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <FormInput
                type="text"
                id="credential-label"
                fieldName="credentialLabel"
                label={t("credential_form_label")}
                value={values.credentialLabel}
                error={Boolean(touched.credentialLabel && errors.credentialLabel)}
                errorMessage={errors.credentialLabel}
                valueCopy={true}
                inputProps={{ maxLength: 100 }}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <SecretInput
                id="credential-secret"
                fieldName="credentialSecret"
                label={t("credential_form_secret")}
                value={values.credentialSecret}
                error={Boolean(touched.credentialSecret && errors.credentialSecret)}
                errorMessage={errors.credentialSecret}
                inputProps={{ maxLength: 100 }}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <FormInput
                type="text"
                id="credential-notes"
                fieldName="description"
                label={t("credential_form_description")}
                value={values.description}
                error={Boolean(touched.description && errors.description)}
                errorMessage={errors.description}
                valueCopy={true}
                multiline
                maxRows={2}
                inputProps={{ maxLength: 100 }}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {isUpdate && credentialPubKey && (
                <Typography variant="body2" component="div" color="gray">
                  Address: {credentialPubKey.toBase58()}
                </Typography>
              )}

              {errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}

              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-start", flex: 1 }}>
                  {isUpdate && (
                    <LoadingButton
                      disabled={isSubmitting}
                      size="medium"
                      variant="contained"
                      color="warning"
                      onClick={handleDeleteCredentialRequest}
                    >
                      {t("delete_credential")}
                    </LoadingButton>
                  )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <LoadingButton
                    disabled={isSubmitting}
                    size="medium"
                    variant="contained"
                    color="info"
                    onClick={goToPreviousPage}
                  >
                    {t("form_cancel")}
                  </LoadingButton>
                  <LoadingButton
                    loading={loading}
                    loadingPosition="center"
                    disabled={isSubmitting}
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {t("form_save")}
                  </LoadingButton>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default CredentialPage;
