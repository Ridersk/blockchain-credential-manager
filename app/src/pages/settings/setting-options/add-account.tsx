import { LoadingButton } from "@mui/lab";
import { Box, Container, Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import AccountList from "components/account-list/account-list";
import { FormInput } from "components/ui/form/inputs/form-input";
import WarningModal from "components/ui/modal/modal-warning";
import useNotification from "hooks/useNotification";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { useTypedSelector } from "hooks/useTypedSelector";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import SwipeableViews from "react-swipeable-views";
import { addNewAccountAction, WalletRequestError } from "store/actionCreators";
import { sleep } from "utils/time";

const AddAccountPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const sendNotification = useNotification();
  const mnemonic = useTypedSelector((state) => state.wallet.mnemonic);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [customId, setCustomId] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<SelectedAccount>();

  const handleAddAccount = async () => {
    try {
      const accountId: string = customId ? customId : selectedAccount?.id!;
      const accountCreated: boolean = unwrapResult(
        await dispatch(
          addNewAccountAction({ ...(selectedAccount as SelectedAccount), id: accountId })
        )
      );
      if (accountCreated) {
        sendNotification({
          message: t("register_successfully"),
          variant: "success"
        });
        await sleep(100);
        navigate(-1);
      } else {
        throw new Error("Error on add account");
      }
    } catch (err) {
      if (err instanceof WalletRequestError) {
        sendNotification({ message: err?.message, variant: "error" });
      } else {
        sendNotification({
          message: t("unexpected_error"),
          variant: "error"
        });
      }
    }
  };

  const handleStepChange = (index: number) => {
    setActiveStep(index);
  };

  const handleBackStep = () => {
    setActiveStep(activeStep > 0 ? activeStep - 1 : 0);
  };

  const handleCustomIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomId(event.target.value);
  };

  const handleSelectAccount = async (account: SelectedAccount) => {
    setSelectedAccount(account);
    handleStepChange(activeStep + 1);
  };

  const handleOpenAddAccountModal = () => {
    setModalOpen(true);
  };

  return (
    <div>
      <WarningModal
        open={modalOpen}
        title={t("warning_add_account_title")}
        description={t("warning_add_account_description")}
        onCancel={() => setModalOpen(false)}
        onAccept={handleAddAccount}
      />

      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t("add_account")}
          </Typography>
        </Box>

        <Box my={4}>
          <FormInput
            type="text"
            id="credential-secret"
            name="secret"
            label={t("account_name")}
            value={customId}
            valueCopy={true}
            onChange={handleCustomIdChange}
          />
        </Box>

        <Box my={4}>
          <SwipeableViews index={activeStep} onChangeIndex={handleStepChange}>
            <AccountList
              sx={{ height: "264px" }}
              mnemonic={mnemonic}
              onSelected={handleSelectAccount}
            />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <LoadingButton
                  disabled={loading}
                  size="medium"
                  variant="contained"
                  color="info"
                  onClick={handleBackStep}
                >
                  {t("form_cancel")}
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  size="medium"
                  loading={loading}
                  loadingPosition="center"
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  onClick={handleOpenAddAccountModal}
                >
                  {t("form_save")}
                </LoadingButton>
              </Box>
            </Box>
          </SwipeableViews>
        </Box>
      </Container>
    </div>
  );
};

export default AddAccountPage;

export type SelectedAccount = {
  id: string;
  publicKey: string;
  privateKey: string;
};
