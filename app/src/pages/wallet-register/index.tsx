import { LoadingButton } from "@mui/lab";
import { Box, Container, Stepper, Step, StepLabel, Typography } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import WalletCreatePassword from "components/wallet-creation/create-password";
import WalletShowMnemonic from "components/wallet-creation/show-mnemonic";
import WalletConfirmMnemonic from "components/wallet-creation/confirm-mnemonic";
import { Formik, FormikHelpers, Form } from "formik";
import * as Yup from "yup";
import { registerNewWallet } from "utils/wallet-generator";
import { useNavigate } from "react-router";
import { setWallet } from "store/actionCreators";
import { useDispatch } from "react-redux";

const WALLET_MODEL = {
  formId: "walletForm",
  formField: {
    password: {
      name: "password",
      label: "wallet_password",
      requiredErrorMessage: "wallet_password_required",
      minSizeErrorMessage: "wallet_password_min_size"
    },
    passwordConfirmation: {
      name: "passwordConfirmation",
      label: "wallet_confirm_password",
      requiredErrorMessage: "wallet_confirm_password_required",
      wrongPasswordConfirmErrorMessage: "wallet_confirm_password_wrong"
    },
    mnemonic: {
      name: "mnemonic",
      label: "wallet_mnemonic",
      requiredErrorMessage: "wallet_mnemonic_required"
    },
    mnemonicConfirmation: {
      name: "mnemonicConfirmation",
      label: "wallet_mnemonic",
      requiredErrorMessage: "wallet_confirm_mnemonic_required",
      wrongPhraseConfirmErrorMessage: "wallet_confirm_mnemonic_wrong"
    }
  }
};

interface WalletFormParams {
  password?: string;
  passwordConfirmation?: string;
  mnemonic?: string;
  mnemonicConfirmation?: string;
}

const INITIAL_VALUES: WalletFormParams = {
  password: "",
  passwordConfirmation: "",
  mnemonic: "",
  mnemonicConfirmation: ""
};

const VALIDATION_SCHEMA = [
  Yup.object().shape({
    [WALLET_MODEL.formField.password.name]: Yup.string()
      .min(8)
      .required(WALLET_MODEL.formField.password.requiredErrorMessage),
    [WALLET_MODEL.formField.passwordConfirmation.name]: Yup.string()
      .required(WALLET_MODEL.formField.passwordConfirmation.requiredErrorMessage)
      .oneOf(
        [Yup.ref(WALLET_MODEL.formField.password.name), "", null, undefined],
        WALLET_MODEL.formField.passwordConfirmation.wrongPasswordConfirmErrorMessage
      )
  }),
  Yup.object().shape({
    [WALLET_MODEL.formField.mnemonic.name]: Yup.string().required(
      WALLET_MODEL.formField.mnemonic.requiredErrorMessage
    )
  }),
  Yup.object().shape({
    [WALLET_MODEL.formField.mnemonicConfirmation.name]: Yup.string()
      .required(WALLET_MODEL.formField.mnemonicConfirmation.requiredErrorMessage)
      .oneOf(
        [Yup.ref(WALLET_MODEL.formField.mnemonic.name), "", null, undefined],
        WALLET_MODEL.formField.mnemonicConfirmation.wrongPhraseConfirmErrorMessage
      )
  })
];

const WalletRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const currentValidationSchema = VALIDATION_SCHEMA[activeStep];
  const steps = [
    t("wallet_protect_vault"),
    t("wallet_recover_vault"),
    t("wallet_confirm_mnemonic")
  ];
  const dispatch = useDispatch();
  const isLastStep = activeStep === steps.length - 1;

  const handleStepChange = (index: number) => {
    setActiveStep(index);
  };
  const handleBackStep = () => {
    setActiveStep(activeStep > 0 ? activeStep - 1 : 0);
  };

  async function submitForm(values: WalletFormParams, actions: FormikHelpers<WalletFormParams>) {
    const walletKeyPair = await registerNewWallet(
      values.mnemonic as string,
      values.password as string
    );
    actions.setSubmitting(false);
    dispatch(setWallet({ id: "Wallet", address: walletKeyPair.publicKey.toBase58() }));
    navigate({ pathname: "/" });
  }

  const handleSubmit = async (
    values: WalletFormParams,
    actions: FormikHelpers<WalletFormParams>
  ) => {
    console.log("SUBMIT");
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
            <Form id={WALLET_MODEL.formId}>
              <SwipeableViews index={activeStep} onChangeIndex={handleStepChange}>
                <WalletCreatePassword formField={WALLET_MODEL.formField} />
                <WalletShowMnemonic
                  formField={WALLET_MODEL.formField}
                  onPhraseGenerated={setFieldValue}
                />
                <WalletConfirmMnemonic formField={WALLET_MODEL.formField} />
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

export default WalletRegister;
