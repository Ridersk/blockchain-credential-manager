import { Box } from "@mui/material";
import { Container } from "@mui/system";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: "block",
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "auto"
      }}
    >
      <Header
        sx={{
          marginBottom: "32px"
        }}
      />
      <Container
        sx={{
          width: { xs: "400px", sm: "100%" },
          height: { xs: "600px", sm: "100%" }
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;
