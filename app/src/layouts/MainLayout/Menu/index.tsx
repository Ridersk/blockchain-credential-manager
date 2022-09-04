import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  styled,
  SxProps,
  Typography,
  useTheme
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import ListItemIcon from "@mui/material/ListItemIcon";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import { useTranslation } from "react-i18next";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { useEffect, useState } from "react";
import { getAccountsAction, lockWalletAction, selectAccountAction } from "store/actionCreators";
import { unwrapResult } from "@reduxjs/toolkit";
import { formatAddress } from "utils/address";
import useNotification from "hooks/useNotification";
import { useNavigate } from "react-router";

const MENU_DRAWER_WIDTH = 240;

interface Props {
  open: boolean;
  onToggle: (open: boolean) => void;
  sx?: SxProps;
}

const MenuDrawer = (props: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const sendNotification = useNotification();
  const [accounts, setAccounts] = useState<{ id: string; address: string }[]>([]);
  const { open, onToggle, ...otherProps } = props;

  useEffect(() => {
    async function getAccounts() {
      const savedAccounts = unwrapResult(await dispatch(getAccountsAction()));
      const formattedAccounts = [];
      for (const account of savedAccounts) {
        formattedAccounts.push({ id: account.id, address: account.publicKey });
      }
      setAccounts(formattedAccounts);
    }
    getAccounts();
  }, [open]);

  const refreshAppUI = () => {
    window.location.reload();
  };

  const handleLock = async () => {
    try {
      const isUnlocked = unwrapResult(await dispatch(lockWalletAction()));

      if (isUnlocked) {
        throw new Error("Error on locking wallet");
      }

      refreshAppUI();
      navigate({ pathname: "/" });
    } catch (err) {
      sendNotification({ message: t("error_lock_wallet"), variant: "error" });
    }
  };

  const handleSelectAccount = async (address: string) => {
    unwrapResult(await dispatch(selectAccountAction(address)));
    refreshAppUI();
    onToggle(false);
  };

  const handleSelectedOption = (optionAction: () => void) => {
    optionAction();
    onToggle(false);
  };

  const renderAccount = (account: { id: string; address: string }) => {
    return (
      <Box>
        <Typography
          variant="body1"
          component="span"
          align="center"
          margin={{ xs: "2px", md: "4px" }}
        >
          {account.id}
        </Typography>
        <Typography
          variant="body2"
          component="span"
          color="gray"
          align="center"
          margin={{ xs: "2px", md: "4px" }}
        >
          ({formatAddress(account.address)})
        </Typography>
      </Box>
    );
  };

  return (
    <Drawer
      {...otherProps}
      sx={{
        width: MENU_DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: MENU_DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.default
        }
      }}
      anchor="left"
      open={open}
      onClose={() => onToggle(false)}
    >
      <DrawerHeader>
        <IconButton onClick={() => onToggle(false)}>
          {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {accounts.map((account, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => {
                handleSelectAccount(account.address);
              }}
            >
              <ListItemText primary={renderAccount(account)} />
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleSelectedOption(() =>
                    navigate({
                      pathname: "/settings/account",
                      search: `?address=${account.address}`
                    })
                  );
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[
          {
            title: t("settings"),
            icon: <SettingsIcon />,
            action: () => handleSelectedOption(() => navigate("/settings"))
          },
          { title: t("lock_wallet"), icon: <LockIcon />, action: handleLock }
        ].map((item, index) => (
          <ListItem key={index} disablePadding onClick={item.action}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default styled(MenuDrawer)({});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end"
}));
