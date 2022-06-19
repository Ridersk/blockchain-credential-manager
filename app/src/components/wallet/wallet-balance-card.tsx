import { Avatar, Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import getPrice from "services/asset-price-api/binance-api";

interface WalletBalanceCardProps {
  dataLoaded?: boolean;
  balance: number;
}

const WalletBalanceCard = ({ dataLoaded = true, balance }: WalletBalanceCardProps) => {
  const [loading, setLoading] = useState(false);
  const [pairPrice, setPairPrice] = useState("0");

  useEffect(() => {
    async function handleGetCurrentPrice() {
      try {
        setLoading(true);
        if (balance) {
          const priceDetails = await getPrice({ target: "brl", balance });
          setPairPrice(priceDetails.formattedPrice);
        }
        setLoading(false);
      } catch (err) {}
    }

    handleGetCurrentPrice();
  }, [balance]);

  return (
    <Card>
      <CardContent sx={{ display: "flex", padding: { xs: "4px", md: "16px" } }}>
        <Box sx={{ width: "16%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          {dataLoaded ? (
            <Avatar
              src="https://assets.coingecko.com/coins/images/4128/large/solana.png"
              sx={{ width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 } }}
            />
          ) : (
            <Skeleton variant="circular" animation="wave" sx={{ width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 } }} />
          )}
        </Box>
        <Box sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          {dataLoaded ? (
            <Typography component="div" variant="h4" noWrap>
              {pairPrice}
            </Typography>
          ) : (
            <Skeleton variant="text" animation="wave" height={32} width="40%" sx={{ alignSelf: "center" }} />
          )}

          {dataLoaded ? (
            <Typography component="div" variant="h6" noWrap color="gray">
              {balance} SOL
            </Typography>
          ) : (
            <Skeleton variant="text" animation="wave" height={32} width="60%" sx={{ alignSelf: "center" }} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletBalanceCard;
