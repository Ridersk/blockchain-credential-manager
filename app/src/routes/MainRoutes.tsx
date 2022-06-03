// project imports
import MinimalLayout from "layouts/MinimalLayout";
import CredentialCreation from "pages/credential-creation";
import { Link } from "react-router-dom";

// ==============================|| ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/",
      element: (
        <div>
          Home Page
          <br />
          <Link to={{ pathname: "/credentials-creation" }}>Criar Credencial</Link>
        </div>
      )
    },
    {
      path: "/credentials-creation",
      element: <CredentialCreation />
    }
  ]
};

export default MainRoutes;
