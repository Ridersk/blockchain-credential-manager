import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import VaultAccountBalanceCard from "./vault-account-balance-card";
import VaultAccountOptionsGroup from "./vault-account-options-group";
import { updateWalletAction } from "store/actionCreators";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { unwrapResult } from "@reduxjs/toolkit";
import { getDetailsAction } from "store/actionCreators/vault";

const VaultAccountDetailsPanel = () => {
  const dispatch = useTypedDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function handleGetVaultAccountDetails() {
      try {
        setLoading(true);
        const vaultAccountDetails = unwrapResult(await dispatch(getDetailsAction()));
        dispatch(updateWalletAction({ balance: vaultAccountDetails.balance }));
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    handleGetVaultAccountDetails();
  }, []);

  return (
    <Box>
      <VaultAccountBalanceCard dataLoaded={!loading} sx={{ marginBottom: "24px" }} />
      <VaultAccountOptionsGroup sx={{ marginBottom: "12px", marginTop: "12px" }} />
    </Box>
  );
};

export default VaultAccountDetailsPanel;
