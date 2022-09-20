import { Avatar, Box, Card, CardContent, Skeleton, styled, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { useEffect, useState } from "react";
import getPrice from "services/asset-price-api/binance-api";
import { useTypedSelector } from "hooks/useTypedSelector";
import Logger from "utils/log";

interface VaultAccountBalanceCardProps {
  dataLoaded?: boolean;
  sx?: SxProps;
}

const VaultAccountBalanceCard = (props: VaultAccountBalanceCardProps) => {
  const { dataLoaded = true, ...otherProps } = props;
  const balance = useTypedSelector((state) => state.wallet.balance);
  const [loading, setLoading] = useState(false);
  const [fiatPrice, setFiatPrice] = useState("");

  useEffect(() => {
    async function handleGetCurrentPrice() {
      try {
        setLoading(true);
        const priceDetails = await getPrice({ target: "brl", balance });
        setFiatPrice(priceDetails.formattedPrice);
        setLoading(false);
      } catch (error) {
        Logger.error(error);
      }
    }

    handleGetCurrentPrice();
  }, [balance]);

  return (
    <Card {...otherProps}>
      <CardContent
        sx={{
          display: "flex",
          height: "144px",
          padding: "4px !important"
        }}
      >
        <Box
          sx={{
            width: "24%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {dataLoaded ? (
            <Avatar
              src="https://assets.coingecko.com/coins/images/4128/large/solana.png"
              sx={{ width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 } }}
            />
          ) : (
            <Skeleton
              variant="circular"
              animation="wave"
              sx={{ width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 } }}
            />
          )}
        </Box>
        <Box
          sx={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          {dataLoaded && !loading ? (
            <Typography component="div" variant="h4" noWrap>
              {fiatPrice}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              animation="wave"
              height={32}
              width="40%"
              sx={{ alignSelf: "center" }}
            />
          )}

          {dataLoaded ? (
            <Typography component="div" variant="h6" noWrap color="gray">
              {balance} SOL
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              animation="wave"
              height={32}
              width="60%"
              sx={{ alignSelf: "center" }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default styled(VaultAccountBalanceCard)<VaultAccountBalanceCardProps>({});
