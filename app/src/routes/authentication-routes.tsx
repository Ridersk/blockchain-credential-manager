// project imports
import MinimalLayout from "layouts/MinimalLayout";
import WalletRegister from "pages/wallet-register";
import Login from "pages/login";
import Welcome from "pages/welcome";

// ==============================|| AUTHENTICATION ROUTING ||============================== //
const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/welcome",
      element: <Welcome />
    },
    {
      path: "/register",
      element: <WalletRegister />
    }
  ]
};

export default AuthenticationRoutes;
