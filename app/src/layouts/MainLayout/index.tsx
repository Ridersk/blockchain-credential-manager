import { Container } from "@mui/system";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <Container
      sx={{
        minWidth: "400px",
        width: { xs: "400px", md: "100%" },
        minHeight: "600px",
        height: "100vh",
        display: "contents"
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
    </Container>
  );
};

export default MainLayout;
