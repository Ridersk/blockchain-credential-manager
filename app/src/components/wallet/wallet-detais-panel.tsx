import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import WalletBalanceCard from "./wallet-balance-card";
import WalletOptionsGroup from "./wallet-options-group";
import { updateWalletAction } from "store/actionCreators";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { unwrapResult } from "@reduxjs/toolkit";
import { getDetailsAction } from "store/actionCreators/account";

const WalletDetailsPanel = () => {
  const dispatch = useTypedDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function handleGetWalletDetails() {
      try {
        setLoading(true);
        const walletDetails = unwrapResult(await dispatch(getDetailsAction()));
        dispatch(updateWalletAction({ balance: walletDetails.balance }));
      } finally {
        setLoading(false);
      }
    }

    handleGetWalletDetails();
  }, []);

  return (
    <Box>
      <WalletBalanceCard dataLoaded={!loading} sx={{ marginBottom: "24px" }} />
      <WalletOptionsGroup sx={{ marginBottom: "12px", marginTop: "12px" }} />
    </Box>
  );
};

export default WalletDetailsPanel;
