import { Box } from "@mui/material";
import { Container } from "@mui/system";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Container sx={{ width: { xs: "400px", sm: "100%" }, height: { xs: "600px", sm: "100%" } }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;
