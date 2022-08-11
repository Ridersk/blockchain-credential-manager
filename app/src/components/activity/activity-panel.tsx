import { Box, List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ActivityCard from "./activity-card";
import { useTranslation } from "react-i18next";
import { VaultActivity } from "scripts/wallet-manager/controllers/vault";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { getActivitiesAction } from "store/actionCreators/vault";
import { unwrapResult } from "@reduxjs/toolkit";

enum InstructionTypeTitle {
  "CREATE_CREDENTIAL" = "transaction_credential_created",
  "EDIT_CREDENTIAL" = "transaction_credential_edited",
  "DELETE_CREDENTIAL" = "transaction_credential_deleted",
  "TRANSFER" = "transaction_amount_received",
  "SUCCESS" = "transaction_generic_success",
  "ERROR" = "transaction_generic_error"
}

export const ActivityPanel = () => {
  const { t } = useTranslation();
  const dispatch = useTypedDispatch();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<VaultActivity[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setTransactions(unwrapResult(await dispatch(getActivitiesAction())));
      setLoading(false);
    })();
  }, []);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {loading ? (
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
      ) : (
        <List>
          {transactions.map((transaction, index) => (
            <ListItem sx={{ display: "block", padding: "8px 0px 8px 0px" }} key={index}>
              <ActivityCard
                title={t(
                  InstructionTypeTitle[transaction.type as keyof typeof InstructionTypeTitle],
                  transaction.extraParams
                )}
                txSignature={transaction.txSignature}
                toAddress={transaction.toAddress}
                fromAddress={transaction.fromAddress}
                status={transaction.status}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
