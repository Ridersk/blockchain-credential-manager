import { Box, Container, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useNotification from "hooks/useNotification";
import CredentialDeletionWarningModal from "components/credential/credential-deletion-warning-modal";
import { extractURLHashSearchParams, extractURLOrigin } from "utils/url";
import { SecretInput } from "components/ui/form/inputs/secret-input";
import { FormInput } from "components/ui/form/inputs/form-input";
import {
  createCredentialAction,
  CredentialRequestError,
  deleteCredentialAction,
  editCredentialAction,
  getCredentialAction
} from "store/actionCreators/credential";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { unwrapResult } from "@reduxjs/toolkit";
import { forceUpdateWalletAction } from "store/actionCreators";
import { sleep } from "utils/time";
import { usePrev } from "hooks/usePrev";
import Logger from "utils/log";

const CredentialPage = () => {
  const location = useLocation();
  const prevLocation = usePrev(location);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const sendNotification = useNotification();
  const [credentialAddress, setCredentialAddress] = useState<string>();
  const [uid, setUid] = useState<number>();
  const [credentialForm, setCredentialForm] = useState<FormValues>({
    title: "",
    url: "",
    label: "",
    secret: "",
    description: ""
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentWindowId, setCurrentWindowId] = useState<number>();
  const [originIsPopupInPage, setOriginIsPopupInPage] = useState<boolean>(false);

  useEffect(() => {
    const locationUrlQsParams = extractURLHashSearchParams(window.location.toString());
    const windowId = new URLSearchParams(locationUrlQsParams).get("window-id");
    const origin = new URLSearchParams(locationUrlQsParams).get("origin");

    if (windowId) {
      setCurrentWindowId(Number(windowId));
    }

    if (origin === "popupInPage") {
      setOriginIsPopupInPage(true);
    }
  }, []);

  // Get Data from blockchain to edit existing credential
  useEffect(() => {
    async function getCredentialToEdit() {
      const locationUrlQsParams = extractURLHashSearchParams(window.location.toString());
      const selectedCredAddress = new URLSearchParams(locationUrlQsParams).get("cred");

      if (selectedCredAddress) {
        const credential = unwrapResult(await dispatch(getCredentialAction(selectedCredAddress)));

        if (credential) {
          setCredentialAddress(selectedCredAddress);
          setUid(credential.uid);
          setCredentialForm({
            title: credential.title,
            url: credential.url,
            label: credential.label,
            secret: credential.secret,
            description: credential.description
          });
          setIsUpdate(true);
        }
      }
    }

    getCredentialToEdit();
  }, []);

  // Get Data from user current external website page
  useEffect(() => {
    async function getUserValue() {
      if (chrome?.tabs) {
        const tabQuery: chrome.tabs.QueryInfo = {};
        let generatedSecret: string;

        tabQuery.active = true;
        if (currentWindowId) {
          tabQuery.windowId = currentWindowId;
        } else {
          tabQuery.currentWindow = true;
        }

        try {
          generatedSecret = (prevLocation?.state as any).generatedSecret;
        } catch (e) {
          generatedSecret = "";
        }

        // Send a request to the content script to get current tab input value.
        const [tab] = await chrome.tabs.query(tabQuery);
        chrome.tabs.sendMessage(
          tab.id!,
          { action: "getInputFormCredentials" },
          function (response) {
            setCredentialForm({
              title: extractURLOrigin(tab.url || ""),
              url: extractURLOrigin(tab.url || ""),
              label: response?.data.label,
              secret: generatedSecret || response?.data.password,
              description: ""
            });
          }
        );
      }
    }

    getUserValue();
  }, [currentWindowId]);

  const goToPreviousPage = () => {
    navigate(-1);
  };

  const sendCredentialToCurrentPage = async (values: FormValues) => {
    const tabQuery: chrome.tabs.QueryInfo = {};

    tabQuery.active = true;
    if (currentWindowId) {
      tabQuery.windowId = currentWindowId;
    } else {
      tabQuery.currentWindow = true;
    }

    // Send a request to the content script to get current tab input value.
    const [tab] = await chrome.tabs.query(tabQuery);
    chrome.tabs.sendMessage(tab.id!, {
      action: "credentialSaved",
      data: { label: values.label, password: values.secret }
    });
  };

  const handleSaveCredential = async (values: FormValues) => {
    /*
     * Send credentials to blockchain
     */

    try {
      setLoading(true);
      if (isUpdate && credentialAddress && uid) {
        unwrapResult(
          await dispatch(
            editCredentialAction({
              address: credentialAddress,
              uid,
              title: values.title,
              url: values.url,
              label: values.label,
              secret: values.secret,
              description: values.description
            })
          )
        );
        sendNotification({
          message: t("operation_credential_edited_successfully"),
          variant: "info"
        });
      } else {
        unwrapResult(
          await dispatch(
            createCredentialAction({
              title: values.title,
              url: values.url,
              label: values.label,
              secret: values.secret,
              description: values.description
            })
          )
        );
        sendNotification({
          message: t("operation_credential_created_successfully"),
          variant: "info"
        });
      }

      await dispatch(forceUpdateWalletAction());
      await sleep(100);

      if (originIsPopupInPage) {
        await sendCredentialToCurrentPage(values);
        const windowsId = (await chrome.windows.getCurrent()).id;
        await chrome.windows.remove(windowsId!);
      }

      goToPreviousPage();
    } catch (error) {
      Logger.error(error);
      if (error instanceof CredentialRequestError) {
        sendNotification({ message: error?.message, variant: "error" });
      } else {
        sendNotification({ message: t("operation_unknown_error"), variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredential = async () => {
    try {
      setLoading(true);
      if (isUpdate && credentialAddress && uid) {
        unwrapResult(await dispatch(deleteCredentialAction(credentialAddress)));
        sendNotification({
          message: t("operation_credential_deleted_successfully"),
          variant: "info"
        });
      }

      await dispatch(forceUpdateWalletAction());
      await sleep(100);

      if (originIsPopupInPage) {
        await sendCredentialToCurrentPage({
          title: "",
          url: "",
          label: "",
          secret: "",
          description: ""
        });
        const windowsId = (await chrome.windows.getCurrent()).id;
        await chrome.windows.remove(windowsId!);
      }

      goToPreviousPage();
    } catch (error) {
      Logger.error(error);
      if (error instanceof CredentialRequestError) {
        sendNotification({ message: error?.message, variant: "error" });
      } else {
        sendNotification({ message: t("operation_unknown_error"), variant: "error" });
      }
    } finally {
      setLoading(false);
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
            title: credentialForm.title,
            url: credentialForm.url,
            label: credentialForm.label,
            secret: credentialForm.secret,
            description: credentialForm.description
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(50).required(t("required_field")),
            url: Yup.string().max(100).required(t("required_field")),
            label: Yup.string().max(100).required(t("required_field")),
            secret: Yup.string().max(100).required(t("required_field")),
            description: Yup.string().max(100)
          })}
          enableReinitialize
          onSubmit={handleSaveCredential}
        >
          {({ errors, handleBlur, handleChange, isSubmitting, touched, values }) => (
            <Form id="credential-form">
              <FormInput
                type="text"
                id="credential-title"
                name="title"
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
                name="url"
                label={t("credential_form_url")}
                value={values.url}
                error={Boolean(touched.url && errors.url)}
                errorMessage={errors.url}
                inputProps={{ maxLength: 100 }}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <FormInput
                type="text"
                id="credential-label"
                name="label"
                label={t("credential_form_label")}
                value={values.label}
                error={Boolean(touched.label && errors.label)}
                errorMessage={errors.label}
                valueCopy={true}
                inputProps={{ maxLength: 100 }}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <SecretInput
                id="credential-secret"
                name="secret"
                label={t("credential_form_secret")}
                value={values.secret}
                error={Boolean(touched.secret && errors.secret)}
                errorMessage={errors.secret}
                inputProps={{ maxLength: 100 }}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <FormInput
                type="text"
                id="credential-notes"
                name="description"
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

              {isUpdate && credentialAddress && (
                <Typography variant="body2" component="div" color="gray">
                  Address: {credentialAddress}
                </Typography>
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
                    type="submit"
                    size="medium"
                    loading={loading}
                    loadingPosition="center"
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                  >
                    {t("form_save")}
                  </LoadingButton>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default CredentialPage;

type FormValues = {
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;
};
