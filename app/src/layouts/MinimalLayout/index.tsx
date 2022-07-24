import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

// project imports
import Customization from "../Customization";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout: React.FC = (): JSX.Element => (
  // <Container sx={{ width: { xs: "400px", md: "100%" }, height: { xs: "600px", md: "100%" } }}>
  <Container
    sx={{
      minWidth: "400px",
      width: { xs: "400px", md: "100%" },
      minHeight: "600px",
      height: "100vh"
    }}
  >
    <Outlet />
    {/* <Customization /> */}
  </Container>
);

export default MinimalLayout;
