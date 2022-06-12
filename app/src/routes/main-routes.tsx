// project imports
import MainLayout from "layouts/MainLayout";
import CredentialCreation from "pages/credential-creation";
import Home from "pages/home";

// ==============================|| ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/credential",
      element: <CredentialCreation />
    }
  ]
};

export default MainRoutes;
