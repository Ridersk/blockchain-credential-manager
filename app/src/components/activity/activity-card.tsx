import SuccessIcon from "@mui/icons-material/Done";
import ReceivedIcon from "@mui/icons-material/CallReceivedRounded";
import ErrorIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

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
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=custom&customUrl=${process.env.REACT_APP_CLUSTER_URL}`}
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
