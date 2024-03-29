import "./polyfill";
import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom";

import { Provider } from "react-redux";

import App from "./App";
import { store } from "store";
import config from "config";
import { SnackbarProvider } from "notistack";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={4} preventDuplicate>
      <HashRouter basename={config.basename}>
        <App />
      </HashRouter>
    </SnackbarProvider>
  </Provider>
);
