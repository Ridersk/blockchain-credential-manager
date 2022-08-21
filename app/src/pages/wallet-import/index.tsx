import { Container } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import AccountListSelectionPanel from "components/account-list/account-list-selection-panel";
import useNotification from "hooks/useNotification";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import SwipeableViews from "react-swipeable-views";
import { createNewWalletAction } from "store/actionCreators";
import { sleep } from "utils/time";
import WalletImportMnemonicForm from "./wallet-import-mnemonic-form";

type ImportWithMnemonicParams = {
  mnemonic: string;
  password: string;
};

const WalletImportPage = () => {
  const { t } = useTranslation();
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const sendNotification = useNotification();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submitAccount = async (account: { id: string; publicKey: string; privateKey: string }) => {
    try {
      const isUnlocked: boolean = unwrapResult(
        await dispatch(
          createNewWalletAction({
            mnemonic,
            password,
            firstVaultAccount: { ...account }
          })
        )
      );
      if (isUnlocked) {
        sendNotification({
          message: t("register_successfully"),
          variant: "success"
        });
        await sleep(100);
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
    }
  };

  const handleStepChange = (index: number) => {
    setActiveStep(index);
  };

  const handleBackStep = () => {
    setActiveStep(activeStep > 0 ? activeStep - 1 : 0);
  };

  const setFormData = async (values: ImportWithMnemonicParams) => {
    setMnemonic(values.mnemonic);
    setPassword(values.password);
    setActiveStep(activeStep + 1);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: "16px" }}>
      <SwipeableViews index={activeStep} onChangeIndex={handleStepChange}>
        <WalletImportMnemonicForm onSubmit={setFormData} />
        <AccountListSelectionPanel
          mnemonic={mnemonic}
          onSelected={submitAccount}
          onCancel={handleBackStep}
        />
      </SwipeableViews>
    </Container>
  );
};

export default WalletImportPage;
