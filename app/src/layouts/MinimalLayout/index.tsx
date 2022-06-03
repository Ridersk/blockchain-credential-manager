import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

// project imports
import Customization from "../Customization";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout: React.FC = (): JSX.Element => (
  <Container style={{ minWidth: "400px", minHeight: "600px" }}>
    <Outlet />
    {/* <Customization /> */}
  </Container>
);

export default MinimalLayout;
