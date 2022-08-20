// project imports
import MainLayout from "layouts/MainLayout";
import CredentialPage from "pages/credential";
import CredentialGeneratorPage from "pages/credential-generator";
import HomePage from "pages/home";

// ==============================|| ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/credential",
      element: <CredentialPage />
    },
    {
      path: "/generate",
      element: <CredentialGeneratorPage />
    }
  ]
};

export default MainRoutes;
