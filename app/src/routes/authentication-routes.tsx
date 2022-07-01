import { lazy } from "react";

// project imports
import Loadable from "components/ui/loader/loadable";
import MinimalLayout from "layouts/MinimalLayout";
import WalletRegister from "pages/wallet-register";

// login routing
const AuthLogin = Loadable(lazy(() => import("pages/authentication")));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      // path: "/login",
      path: "/login",
      element: <AuthLogin />
    },
    {
      path: "/register",
      element: <WalletRegister />
    }
  ]
};

export default AuthenticationRoutes;
