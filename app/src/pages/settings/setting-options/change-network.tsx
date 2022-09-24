import {
  Box,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import useNotification from "hooks/useNotification";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { useTypedSelector } from "hooks/useTypedSelector";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { changeNetworkAction } from "store/actionCreators";
import { NetworkData } from "store/actionTypes";
import { sleep } from "utils/time";
import { NETWORK_OPTIONS } from "../../../scripts/wallet-manager/controllers/network";

const ChangeNetworkPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendNotification = useNotification();
  const dispatch = useTypedDispatch();
  const currentNetwork = useTypedSelector((state) => state.network.network);
  const [networkOptions, setNetworkOptions] = useState<NetworkData[]>([]);

  useEffect(() => {
    const networks: NetworkData[] = [];

    for (const key in NETWORK_OPTIONS) {
      const network = NETWORK_OPTIONS[key as keyof typeof NETWORK_OPTIONS];
      networks.push({ id: network.id, label: network.label, url: network.url });
    }

    setNetworkOptions(networks);
  }, []);

  const handleSelectNetwork = async (network: NetworkData) => {
    unwrapResult(await dispatch(changeNetworkAction(network)));
    sendNotification({
      message: t("network_changed"),
      variant: "success"
    });
    await sleep(100);
    navigate(-1);
    // window.location.reload();
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("change_network")}
        </Typography>

        <Typography variant="caption" component="div" gutterBottom align="center">
          {`${t("current_network")}: ${currentNetwork.label}`}
        </Typography>
      </Box>

      <Box my={4} display="flex" flexDirection="column">
        <List>
          {networkOptions.map((option, index) => (
            <ListItem key={index} disablePadding onClick={() => handleSelectNetwork(option)}>
              <ListItemButton selected={option.id === currentNetwork.id}>
                <ListItemText primary={option.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ChangeNetworkPage;
