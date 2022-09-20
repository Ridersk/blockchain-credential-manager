import { LoadingButton } from "@mui/lab";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import AccountList from "components/account-list/account-list";
import { FormInput } from "components/ui/form/inputs/form-input";
import WarningModal from "components/ui/modal/modal-warning";
import useNotification from "hooks/useNotification";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { useTypedSelector } from "hooks/useTypedSelector";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import SwipeableViews from "react-swipeable-views";
import {
  addNewAccountAction,
  deleteAccountAction,
  editAccountAction,
  getAccountAction,
  getAccountsAction,
  WalletRequestError
} from "store/actionCreators";
import Logger from "utils/log";
import { sleep } from "utils/time";
import { extractURLHashSearchParams } from "utils/url";

const AccountPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const sendNotification = useNotification();
  const mnemonic = useTypedSelector((state) => state.wallet.mnemonic);
  const [modalConfig, setModalConfig] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    action?: () => Promise<void>;
  }>({
    open: false
  });
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [customId, setCustomId] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<SelectedAccount>();
  const [savedAccounts, setSavedAccounts] = useState<{ publicKey: string }[]>([]);
  const [savedAccountsLoaded, setSavedAccountsLoaded] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const locationUrlQsParams = extractURLHashSearchParams(window.location.toString());
      const selectedAccountAddress = new URLSearchParams(locationUrlQsParams).get("address");

      if (selectedAccountAddress) {
        await prepareUpdateAccountData(selectedAccountAddress);
      }
    })();
  }, []);

  useEffect(() => {
    async function getAccounts() {
      try {
        const _savedAccounts = unwrapResult(await dispatch(getAccountsAction()));
        const formattedAccounts = [];
        for (const account of _savedAccounts) {
          formattedAccounts.push({ publicKey: account.publicKey });
        }
        setSavedAccounts(formattedAccounts);
      } catch (error) {
        Logger.error(error);
      } finally {
        setSavedAccountsLoaded(true);
      }
    }
    getAccounts();
  }, []);

  const prepareUpdateAccountData = async (selectedAccountAddress: string) => {
    setIsUpdate(true);
    const account = unwrapResult(await dispatch(getAccountAction(selectedAccountAddress)));
    await handleSelectAccount(account);
    setCustomId(account.id);
  };

  const handleSubmitAccount = async () => {
    try {
      setLoading(true);
      if (isUpdate) {
        await dispatch(
          editAccountAction({
            ...(selectedAccount as SelectedAccount),
            id: customId
          })
        );

        sendNotification({
          message: t("account_edited"),
          variant: "success"
        });
      } else {
        const accountCreated: boolean = unwrapResult(
          await dispatch(
            addNewAccountAction({ ...(selectedAccount as SelectedAccount), id: customId })
          )
        );
        if (accountCreated) {
          sendNotification({
            message: t("account_added"),
            variant: "success"
          });
        } else {
          throw new Error("Error on add account");
        }
      }
      await sleep(100);
      navigate(-1);
    } catch (error) {
      Logger.error(error);
      if (error instanceof WalletRequestError) {
        sendNotification({ message: error?.message, variant: "error" });
      } else {
        sendNotification({
          message: t("unexpected_error"),
          variant: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      unwrapResult(await dispatch(deleteAccountAction(selectedAccount?.publicKey!)));
      sendNotification({
        message: t("account_deleted"),
        variant: "success"
      });
      await sleep(100);
      navigate(-1);
    } catch (error) {
      Logger.error(error);
      if (error instanceof WalletRequestError) {
        sendNotification({ message: error?.message, variant: "error" });
      } else {
        sendNotification({
          message: t("unexpected_error"),
          variant: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStepChange = (index: number) => {
    setActiveStep(index);
  };

  const handleBackStep = () => {
    if (!isUpdate) {
      setActiveStep(activeStep > 0 ? activeStep - 1 : 0);
    } else {
      navigate(-1);
    }
  };

  const handleCustomIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomId(event.target.value);
  };

  const handleSelectAccount = async (account: SelectedAccount) => {
    setSelectedAccount(account);
    handleStepChange(activeStep + 1);
  };

  const handleOpenSubmitAccountModalConfirmation = () => {
    setModalConfig({
      open: true,
      title: !isUpdate ? t("warning_add_account_title") : t("warning_update_account_title"),
      description: isUpdate
        ? t("warning_add_account_description")
        : t("warning_update_account_description"),
      action: handleSubmitAccount
    });
  };

  const handleOpenDeleteAccountModalConfirmation = () => {
    setModalConfig({
      open: true,
      title: t("warning_delete_account_title"),
      description: t("warning_delete_account_description"),
      action: handleDeleteAccount
    });
  };

  return (
    <div>
      <WarningModal
        open={modalConfig.open}
        title={modalConfig.title!}
        description={modalConfig.description!}
        onCancel={() => setModalConfig({ open: false })}
        onAccept={modalConfig.action!}
      />

      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {!isUpdate ? t("add_account") : t("edit_account")}
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
            {savedAccountsLoaded ? (
              <AccountList
                sx={{ height: "264px" }}
                mnemonic={mnemonic}
                excludeAccounts={savedAccounts}
                onSelected={handleSelectAccount}
              />
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <CircularProgress color="secondary" />
              </Box>
            )}
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

                {isUpdate && (
                  <LoadingButton
                    disabled={loading}
                    size="medium"
                    variant="contained"
                    color="warning"
                    onClick={handleOpenDeleteAccountModalConfirmation}
                  >
                    {t("delete_credential")}
                  </LoadingButton>
                )}

                <LoadingButton
                  type="submit"
                  size="medium"
                  loading={loading}
                  loadingPosition="center"
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  onClick={handleOpenSubmitAccountModalConfirmation}
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

export default AccountPage;

export type SelectedAccount = {
  publicKey: string;
  privateKey: string;
};
