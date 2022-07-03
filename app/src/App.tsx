import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

import { theme } from "themes";
import Routes from "routes";
import NavigationScroll from "./layouts/NavigationScroll";
import { useTypedSelector } from "hooks/useTypedSelector";
import getSolanaWorkspace from "services/solana/solanaWeb3";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setWallet } from "store/actionCreators";
import { walletLogged } from "utils/wallet-manager";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customization = useTypedSelector((state) => state.customization);

  const goToWelcomePage = () => {
    navigate({ pathname: "/welcome" });
  };

  const goToLoginPage = () => {
    navigate({ pathname: "/login" });
  };

  useEffect(() => {
    async function handleUpdateKeypair() {
      const walletKeyPair = getSolanaWorkspace().userKeypair;

      // Check if user is registered
      if (walletKeyPair) {
        dispatch(setWallet({ id: "Wallet 1", address: walletKeyPair.publicKey.toBase58() }));
      } else {
        goToWelcomePage();
        return;
      }

      // Check if user is logged
      if (!walletLogged()) {
        goToLoginPage();
      }
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
