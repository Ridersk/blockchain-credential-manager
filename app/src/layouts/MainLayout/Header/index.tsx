import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
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
import { formatAddress } from "utils/address";
import MenuDrawer from "../Menu";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

interface HeaderProps {
  sx?: SxProps;
}

function Header(props: HeaderProps) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [addressTooltip, setAddressTooltip] = useState<string>(t("copy_vault_address"));
  const [menuOpen, setMenuOpen] = useState(false);
  const wallet = useTypedSelector((state) => state.wallet);

  const goToPreviousPage = () => {
    navigate(-1);
  };

  const handleMenuToggle = (open: boolean) => {
    setMenuOpen(open);
  };

  const handleClickCopyAddress = () => {
    copyTextToClipboard(wallet.address);
    setAddressTooltip(t("generic_copied"));
  };

  const resetAddressTooltip = () => {
    setTimeout(() => setAddressTooltip(t("copy_vault_address")), 500);
  };

  return (
    <Box {...props} sx={{ height: "48px" }}>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          bgcolor: theme.palette.background.default,
          backgroundImage: "none"
        }}
        open={menuOpen}
      >
        <Toolbar sx={{ minHeight: "48px !important" }}>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, ...(menuOpen && { display: "none" }) }}
            onClick={() => handleMenuToggle(true)}
          >
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
            <IconButton color="inherit" onClick={goToPreviousPage}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <MenuDrawer open={menuOpen} onToggle={handleMenuToggle} />
    </Box>
  );
}

export default styled(Header)({});
