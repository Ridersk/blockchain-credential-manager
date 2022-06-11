import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

import { theme } from "themes";
import Routes from "routes";
import NavigationScroll from "./layouts/NavigationScroll";
import { useTypedSelector } from "hooks/useTypedSelector";

function App() {
  const customization = useTypedSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
