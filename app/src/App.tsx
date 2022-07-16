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
import { initVaultManager } from "utils/wallet-manager/wallet-manager";
import { VaultNoKeyringFoundError } from "exceptions";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToWelcomePage = () => {
    navigate({ pathname: "/welcome" });
  };

  const goToLoginPage = () => {
    navigate({ pathname: "/login" });
  };

  useEffect(() => {
    async function setupVault() {
      try {
        const vaultManager = await initVaultManager();
        await vaultManager.unlockVault("00000000");
        const walletKeyPair = await vaultManager.getCurrentAccountKeypair();
        await initWorkspace(walletKeyPair as any);
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
