import { lazy } from "react";

// project imports
import Loadable from "components/Loadable";
import MinimalLayout from "layouts/MinimalLayout";

// ==============================|| ROUTING ||============================== //

const MainRoutes = {
    path: "/",
    element: <MinimalLayout />,
    children: [
        {
            path: "/",
            element: <div>Home Page</div>
        }
    ]
};

export default MainRoutes;
