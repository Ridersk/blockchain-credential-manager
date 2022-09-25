import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

import { theme } from "themes";
import Routes from "routes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  updateNetworkFromBackgroundAction,
  updateWalletFromBackgroundAction
} from "store/actionCreators";
import { WalletNoKeyringFoundError } from "exceptions";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { unwrapResult } from "@reduxjs/toolkit";
import Logger from "utils/log";

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
        unwrapResult(await dispatch(updateWalletFromBackgroundAction()));
        unwrapResult(await dispatch(updateNetworkFromBackgroundAction()));
      } catch (error) {
        if (error instanceof WalletNoKeyringFoundError) {
          goToWelcomePage();
        } else {
          goToLoginPage();
        }
        Logger.error("[APP]", error);
        Logger.error(
          "[APP] WalletNoKeyringFoundError?",
          error instanceof WalletNoKeyringFoundError
        );
      } finally {
        setLoading(false);
      }
    }

    setupVault();
  }, []);

  return (
    <div style={{ width: "400px", height: "600px", display: "flex", flexDirection: "column" }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {!loading && <Routes />}
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
