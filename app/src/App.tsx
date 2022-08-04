import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

import { theme } from "themes";
import Routes from "routes";
import NavigationScroll from "./layouts/NavigationScroll";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { forceUpdateWalletAction } from "store/actionCreators";
import { VaultNoKeyringFoundError } from "exceptions";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { unwrapResult } from "@reduxjs/toolkit";

function App() {
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const goToWelcomePage = () => {
    navigate({ pathname: "/welcome" });
  };

  const goToLoginPage = () => {
    navigate({ pathname: "/login" });
  };

  useEffect(() => {
    async function setupVault() {
      try {
        setLoading(true);
        unwrapResult(await dispatch(forceUpdateWalletAction()));
      } catch (err) {
        if (err instanceof VaultNoKeyringFoundError) {
          goToWelcomePage();
        } else {
          goToLoginPage();
        }
      } finally {
        setLoading(false);
      }
    }

    setupVault();
  }, []);

  return (
    <div style={{ minWidth: "400px", minHeight: "600px" }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavigationScroll>{!loading && <Routes />}</NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
