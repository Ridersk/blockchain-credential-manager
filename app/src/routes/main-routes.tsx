// project imports
import MainLayout from "layouts/MainLayout";
import CredentialPage from "pages/credential";
import CredentialGeneratorPage from "pages/credential-generator";
import HomePage from "pages/home";
import SettingsPage from "pages/settings";
import ChangeLanguagePage from "pages/settings/setting-options/change-language";
import { Outlet } from "react-router";

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
    },
    {
      path: "/settings",
      children: [
        {
          path: "",
          element: <SettingsPage />
        },
        {
          path: "change-language",
          element: <ChangeLanguagePage />
        }
      ]
    }
  ]
};

export default MainRoutes;
