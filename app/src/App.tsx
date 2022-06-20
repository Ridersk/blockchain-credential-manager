import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

import { theme } from "themes";
import Routes from "routes";
import NavigationScroll from "./layouts/NavigationScroll";
import { useTypedSelector } from "hooks/useTypedSelector";
import getSolanaWorkspace from "services/solana/solanaWeb3";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { WalletActionType } from "store/actionTypes";

function App() {
  const dispatch = useDispatch();
  const customization = useTypedSelector((state) => state.customization);

  useEffect(() => {
    async function handleUpdateKeypair() {
      const walletKeyPair = await getSolanaWorkspace().userKeypair;
      dispatch({ type: WalletActionType.SET_WALLET, data: { id: "Wallet 1", address: walletKeyPair.publicKey.toBase58() } });
    }

    handleUpdateKeypair();
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
