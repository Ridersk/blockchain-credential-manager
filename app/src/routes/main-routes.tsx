// project imports
import MinimalLayout from "layouts/MinimalLayout";
import CredentialCreation from "pages/credential-creation";
import Home from "pages/home";

// ==============================|| ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/credentials-creation",
      element: <CredentialCreation />
    }
  ]
};

export default MainRoutes;
