import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom";

import { Provider } from "react-redux";

import App from "./App";
import { store } from "store";
import config from "config";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <HashRouter basename={config.basename}>
      <App />
    </HashRouter>
  </Provider>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);
