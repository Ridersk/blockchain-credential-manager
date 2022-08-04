import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getWalletDetails } from "services/solana/getWalletDetails";
import WalletBalanceCard from "./wallet-balance-card";
import WalletOptionsGroup from "./wallet-options-group";
import { useDispatch } from "react-redux";
import { updateWalletAction } from "store/actionCreators";

const WalletDetailsPanel = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function handleGetWalletDetails() {
      try {
        setLoading(true);
        const walletDetails = await getWalletDetails();
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
