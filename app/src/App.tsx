import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

import { theme } from "themes";
import Routes from "routes";
import NavigationScroll from "./layouts/NavigationScroll";
import { initWorkspace } from "services/solana/solanaWeb3";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { updateWallet } from "store/actionCreators";
import { VaultLockedError, VaultNoKeyringFoundError } from "exceptions";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const goToWelcomePage = () => {
    navigate({ pathname: "/welcome" });
  };

  const goToLoginPage = () => {
    navigate({ pathname: "/login" });
  };

  const getStateFromBackgroundAction = async () => {
    const response = await chrome.runtime.sendMessage({
      action: "getState"
    });

    const isinitialed = response.data.isInitialized;

    if (!isinitialed) {
      throw new VaultNoKeyringFoundError();
    }
  };

  const getWalletFromBackgroundAction = async (): Promise<string> => {
    const response = await chrome.runtime.sendMessage({
      action: "getSelectedAddress"
    });
    const publicKey = response?.data?.publicKey;
    const status = response?.data?.status;

    if (status === "NOT_FOUND") {
      throw new VaultNoKeyringFoundError(status);
    }

    if (status !== "UNLOCKED") {
      throw new VaultLockedError("LOCKED");
    }

    return publicKey;
  };

  useEffect(() => {
    async function setupVault() {
      try {
        setLoading(true);
        await getStateFromBackgroundAction();
        const publicKey = await getWalletFromBackgroundAction();

        await initWorkspace(publicKey);
        dispatch(updateWallet({ id: "Wallet 1", address: publicKey }));
      } catch (err) {
        console.log(err);
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
