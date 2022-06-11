import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom";

import { Provider } from "react-redux";

import App from "./App";
import { store } from "store";
import config from "config";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <HashRouter basename={config.basename}>
      <SnackbarProvider maxSnack={4} preventDuplicate>
        <App />
      </SnackbarProvider>
    </HashRouter>
  </Provider>
);
