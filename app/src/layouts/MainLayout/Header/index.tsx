import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { ButtonBase, Tooltip, useTheme } from "@mui/material";
import { SxProps } from "@mui/system";
import { useLocation, useNavigate } from "react-router-dom";
import { useTypedSelector } from "hooks/useTypedSelector";
import { copyTextToClipboard } from "utils/clipboard";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface HeaderProps {
  sx?: SxProps;
}

function Header(props: HeaderProps) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [addressTooltip, setAddressTooltip] = useState<string>(t("copy_vault_address"));
  const wallet = useTypedSelector((state) => state.wallet);

  const handleGoToBack = () => {
    navigate(-1);
  };

  const handleClickCopyAddress = () => {
    copyTextToClipboard(wallet.address);
    setAddressTooltip(t("generic_copied"));
  };

  const resetAddressTooltip = () => {
    setTimeout(() => setAddressTooltip(t("copy_vault_address")), 500);
  };

  function formatAddress(address: string) {
    if (address.length > 12) {
      return (
        address.substring(0, 4) + "..." + address.substring(address.length - 4, address.length)
      );
    }
    return address;
  }

  return (
    <Box {...props} sx={{ height: "48px" }}>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          bgcolor: theme.palette.background.default,
          backgroundImage: "none"
        }}
      >
        <Toolbar sx={{ minHeight: "48px !important" }}>
          <IconButton size="small" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "center"
            }}
          >
            <Tooltip title={addressTooltip} onMouseLeave={resetAddressTooltip}>
              <ButtonBase onClick={handleClickCopyAddress}>
                <Typography
                  variant="h6"
                  component="span"
                  align="center"
                  margin={{ xs: "2px", md: "4px" }}
                >
                  {wallet.id}
                </Typography>
                <Typography
                  variant="h6"
                  component="span"
                  color="gray"
                  align="center"
                  margin={{ xs: "2px", md: "4px" }}
                >
                  ({formatAddress(wallet.address)})
                </Typography>
              </ButtonBase>
            </Tooltip>
          </Box>
          {location.pathname !== "/" && (
            <IconButton color="inherit" onClick={handleGoToBack}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default styled(Header)({});
