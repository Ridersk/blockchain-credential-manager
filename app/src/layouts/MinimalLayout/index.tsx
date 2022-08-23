import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout: React.FC = (): JSX.Element => (
  <Container>
    <Outlet />
  </Container>
);

export default MinimalLayout;
