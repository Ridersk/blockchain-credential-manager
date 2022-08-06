// project imports
import MainLayout from "layouts/MainLayout";
import CredentialPage from "pages/credential";
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
      element: <CredentialPage />
    }
  ]
};

export default MainRoutes;
