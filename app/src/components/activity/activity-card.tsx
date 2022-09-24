import SuccessIcon from "@mui/icons-material/Done";
import ReceivedIcon from "@mui/icons-material/CallReceivedRounded";
import ErrorIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTypedSelector } from "hooks/useTypedSelector";
import { useEffect, useState } from "react";

const BLOCKCHAIN_EXPLORE_URL = "https://explorer.solana.com";

interface Props {
  title: string;
  txSignature: string;
  fromAddress?: string | null;
  toAddress?: string | null;
  status?: "success" | "received" | "error";
}

const ActivityCard = ({
  title,
  txSignature,
  fromAddress,
  toAddress,
  status = "success"
}: Props) => {
  const { t } = useTranslation();
  const currentNetwork = useTypedSelector((state) => state.network.network);
  const [clusterSearchParams, setClusterSearchParams] = useState<string>("");

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (currentNetwork.id === "local") {
      searchParams.set("cluster", "custom");
      searchParams.set("customUrl", currentNetwork.url);
    } else {
      searchParams.set("cluster", currentNetwork.id);
    }

    setClusterSearchParams(searchParams.toString());
  }, [currentNetwork]);

  const renderIcon = () => {
    switch (status) {
      case "success":
        return <SuccessIcon />;
      case "received":
        return <ReceivedIcon />;
      default:
        return <ErrorIcon />;
    }
  };

  return (
    <Card>
      <CardContent
        sx={{ display: "flex", padding: { xs: "8px !important", md: "16px !important" } }}
      >
        <Box
          sx={{
            width: "16%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <IconButton
            href={`${BLOCKCHAIN_EXPLORE_URL}/tx/${txSignature}?${clusterSearchParams}`}
            target="_blank"
          >
            {renderIcon()}
          </IconButton>
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
          <Typography component="div" variant="h6" noWrap>
            {title}
          </Typography>

          {fromAddress && (
            <Typography component="div" variant="subtitle2" noWrap>
              {t("transaction_from")}: {fromAddress}
            </Typography>
          )}

          {toAddress && (
            <Typography component="div" variant="subtitle2" noWrap>
              {t("transaction_to")}: {toAddress}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
