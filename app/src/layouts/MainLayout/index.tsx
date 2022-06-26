import { Box } from "@mui/material";
import { Container } from "@mui/system";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <Box sx={{ display: "block", position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
      <Header sx={{ marginBottom: "32px" }} />
      <Container sx={{ width: { xs: "400px", sm: "100%" }, height: { xs: "600px", sm: "100%" } }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;
