import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoToBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <AppBar
        position="static"
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
            <Typography variant="h6" component="span" align="center" margin={{ sm: "2px", md: "4px" }}>
              Wallet 1
            </Typography>
            <Typography variant="h6" component="span" color="gray" align="center" margin={{ sm: "2px", md: "4px" }}>
              (HRT...F52)
            </Typography>
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
