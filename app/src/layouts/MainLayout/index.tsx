import { Container } from "@mui/system";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <Container sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header
        sx={{
          marginBottom: "32px"
        }}
      />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          paddingLeft: "8px",
          paddingRight: "8px"
        }}
      >
        <Outlet />
      </Container>
    </Container>
  );
};

export default MainLayout;
