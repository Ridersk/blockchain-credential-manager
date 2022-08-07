import { LoadingButton } from "@mui/lab";
import { Box, Container, Stepper, Step, StepLabel, Typography } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import WalletCreatePassword from "components/wallet-register/wallet-create-password";
import WalletShowMnemonic from "components/wallet-register/wallet-show-mnemonic";
import WalletConfirmMnemonic from "components/wallet-register/wallet-confirm-mnemonic";
import { Formik, FormikHelpers, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { createNewVaultAction, unlockWalletAction } from "store/actionCreators";
import useNotification from "hooks/useNotification";
import { unwrapResult } from "@reduxjs/toolkit";
import { useTypedDispatch } from "hooks/useTypedDispatch";

const FORM_MODEL = {
  formId: "formCreateWallet",
  formField: {
    password: {
      name: "password",
      label: "new_password",
      requiredErrorMessage: "password_required",
      minSizeErrorMessage: "password_min_size"
    },
    passwordConfirmation: {
      name: "passwordConfirmation",
      label: "confirm_password",
      requiredErrorMessage: "confirm_password_required",
      wrongPasswordConfirmErrorMessage: "confirm_password_wrong"
    },
    mnemonic: {
      name: "mnemonic",
      label: "mnemonic",
      requiredErrorMessage: "mnemonic_required"
    },
    mnemonicConfirmation: {
      name: "mnemonicConfirmation",
      label: "mnemonic",
      requiredErrorMessage: "confirm_mnemonic_required",
      wrongPhraseConfirmErrorMessage: "confirm_mnemonic_wrong"
    }
  }
};

interface FormParams {
  password?: string;
  passwordConfirmation?: string;
  mnemonic?: string;
  mnemonicConfirmation?: string;
}

const INITIAL_VALUES: FormParams = {
  password: "",
  passwordConfirmation: "",
  mnemonic: "",
  mnemonicConfirmation: ""
};

const VALIDATION_SCHEMA = [
  Yup.object().shape({
    [FORM_MODEL.formField.password.name]: Yup.string()
      .min(8)
      .required(FORM_MODEL.formField.password.requiredErrorMessage),
    [FORM_MODEL.formField.passwordConfirmation.name]: Yup.string()
      .required(FORM_MODEL.formField.passwordConfirmation.requiredErrorMessage)
      .oneOf(
        [Yup.ref(FORM_MODEL.formField.password.name), "", null, undefined],
        FORM_MODEL.formField.passwordConfirmation.wrongPasswordConfirmErrorMessage
      )
  }),
  Yup.object().shape({
    [FORM_MODEL.formField.mnemonic.name]: Yup.string().required(
      FORM_MODEL.formField.mnemonic.requiredErrorMessage
    )
  }),
  Yup.object().shape({
    [FORM_MODEL.formField.mnemonicConfirmation.name]: Yup.string()
      .required(FORM_MODEL.formField.mnemonicConfirmation.requiredErrorMessage)
      .oneOf(
        [Yup.ref(FORM_MODEL.formField.mnemonic.name), "", null, undefined],
        FORM_MODEL.formField.mnemonicConfirmation.wrongPhraseConfirmErrorMessage
      )
  })
];

const WalletRegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendNotification = useNotification();
  const [activeStep, setActiveStep] = useState<number>(0);
  const currentValidationSchema = VALIDATION_SCHEMA[activeStep];
  const steps = [t("protect_vault"), t("recover_vault"), t("confirm_mnemonic")];
  const dispatch = useTypedDispatch();
  const isLastStep = activeStep === steps.length - 1;

  const handleStepChange = (index: number) => {
    setActiveStep(index);
  };
  const handleBackStep = () => {
    setActiveStep(activeStep > 0 ? activeStep - 1 : 0);
  };

  async function submitForm(values: FormParams, actions: FormikHelpers<FormParams>) {
    try {
      await dispatch(
        createNewVaultAction({
          mnemonic: values.mnemonic as string,
          password: values.password as string
        })
      );
      const isUnlocked: boolean = unwrapResult(
        await dispatch(unlockWalletAction(values.password as string))
      );
      if (isUnlocked) {
        sendNotification({
          message: t("register_successfully"),
          variant: "success"
        });
        navigate({ pathname: "/" });
      } else {
        sendNotification({
          message: t("login_incorrect_password"),
          variant: "error"
        });
      }
    } catch (err) {
      sendNotification({
        message: t("unexpected_error"),
        variant: "error"
      });
    } finally {
      actions.setSubmitting(false);
    }
  }

  const handleSubmit = async (values: FormParams, actions: FormikHelpers<FormParams>) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: "16px" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel sx={{ maxWidth: { xs: "80px", md: "120px", lg: "100%" } }}>
              <Typography variant="body2">{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>
        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={currentValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form id={FORM_MODEL.formId}>
              <SwipeableViews index={activeStep} onChangeIndex={handleStepChange}>
                <WalletCreatePassword formField={FORM_MODEL.formField} />
                <WalletShowMnemonic
                  formField={FORM_MODEL.formField}
                  onPhraseGenerated={setFieldValue}
                />
                <WalletConfirmMnemonic formField={FORM_MODEL.formField} />
              </SwipeableViews>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                {activeStep > 0 && (
                  <LoadingButton
                    sx={{ width: { xs: "100%", md: "200px" } }}
                    loading={isSubmitting}
                    loadingPosition="center"
                    disabled={isSubmitting}
                    size="medium"
                    variant="contained"
                    color="info"
                    onClick={handleBackStep}
                  >
                    {t("btn_multistep_back")}
                  </LoadingButton>
                )}
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
                  {isLastStep ? t("btn_multistep_confirm") : t("btn_multistep_next")}
                </LoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default WalletRegisterPage;
