import React from "react";
import { Outlet } from "react-router-dom";

// project imports
import Customization from "../Customization";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout: React.FC = (): JSX.Element => (
    <div style={{ minWidth: "400px", minHeight: "600px" }}>
        <Outlet />
        {/* <Customization /> */}
    </div>
);

export default MinimalLayout;
