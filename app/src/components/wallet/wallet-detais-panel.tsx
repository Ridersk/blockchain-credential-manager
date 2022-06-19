import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { getWalletDetails } from "services/solana/getWalletDetails";
import WalletBalanceCard from "./wallet-balance-card";
import WalletOptionsGroup from "./wallet-options-group";

const WalletDetailsPanel = () => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function handleGetWalletDetails() {
      try {
        setLoading(true);
        const walletDetails = await getWalletDetails();
        setBalance(walletDetails.balance);
        setLoading(false);
      } catch (err) {}
    }

    handleGetWalletDetails();
  }, []);

  return (
    <Container>
      <WalletBalanceCard dataLoaded={!loading} balance={balance} sx={{ marginBottom: "24px" }} />
      <WalletOptionsGroup sx={{ marginBottom: "24px" }} />
    </Container>
  );
};

export default WalletDetailsPanel;
