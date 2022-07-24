import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

import { theme } from "themes";
import Routes from "routes";
import NavigationScroll from "./layouts/NavigationScroll";
import { initWorkspace } from "services/solana/solanaWeb3";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setWallet } from "store/actionCreators";
import { VaultLockedError, VaultNoKeyringFoundError } from "exceptions";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToWelcomePage = () => {
    navigate({ pathname: "/welcome" });
  };

  const goToLoginPage = () => {
    navigate({ pathname: "/login" });
  };

  const getWalletFromBackgroundAction = async () => {
    const response = await chrome.runtime.sendMessage({
      action: "getKeypair"
    });
    const keypair = response?.data?.keypair;
    const status = response?.data?.status;
    console.log("RECEIVED WALLET:", keypair);

    if (status === "NOT_FOUND") {
      throw new VaultNoKeyringFoundError(status);
    }

    if (status !== "UNLOCKED") {
      throw new VaultLockedError("LOCKED");
    }

    return keypair;
  };

  useEffect(() => {
    async function setupVault() {
      try {
        const walletKeyPair = await getWalletFromBackgroundAction();

        // CALL ACTION TO GET WALLET KEYPAIR
        await initWorkspace(walletKeyPair);
        dispatch(setWallet({ id: "Wallet 1", address: walletKeyPair?.publicKey.toBase58() }));
      } catch (err) {
        console.log(err);
        if (err instanceof VaultNoKeyringFoundError) {
          goToWelcomePage();
        } else {
          goToLoginPage();
        }
      }
    }

    setupVault();
  }, []);

  return (
    <div style={{ minWidth: "400px", minHeight: "600px" }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
