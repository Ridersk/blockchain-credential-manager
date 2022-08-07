// project imports
import MinimalLayout from "layouts/MinimalLayout";
import WalletRegisterPage from "pages/wallet-register";
import LoginPage from "pages/login";
import WelcomePage from "pages/welcome";
import WalletImportPage from "pages/wallet-import";

// ==============================|| AUTHENTICATION ROUTING ||============================== //
const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/login",
      element: <LoginPage />
    },
    {
      path: "/welcome",
      element: <WelcomePage />
    },
    {
      path: "/register",
      element: <WalletRegisterPage />
    },
    {
      path: "/import",
      element: <WalletImportPage />
    }
  ]
};

export default AuthenticationRoutes;
