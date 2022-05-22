// project imports
import MinimalLayout from "layouts/MinimalLayout";
import CredentialCreation from "pages/credential-creation";

// ==============================|| ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    // {
    //     path: "/",
    //     element: <div>Home Page</div>
    // },
    {
      path: "/",
      element: <CredentialCreation />
    }
  ]
};

export default MainRoutes;
