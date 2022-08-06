import { lazy } from "react";

// project imports
import Loadable from "components/ui/loader/loadable";
import MinimalLayout from "layouts/MinimalLayout";

// login routing
const AuthLogin = Loadable(lazy(() => import("pages/authentication")));
// const AuthRegister = Loadable(lazy(() => import("pages/authentication/Register")));

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
      //   element: <AuthRegister />
      element: <div>Register Page</div>
    }
  ]
};

export default AuthenticationRoutes;
