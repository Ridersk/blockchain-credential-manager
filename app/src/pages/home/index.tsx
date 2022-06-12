import { Container } from "@mui/material";
import CredentialsPanel from "components/credential/credentials-list-panel";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      <Link to={{ pathname: "/credential" }}>Criar Credencial</Link>
      <CredentialsPanel />
    </Container>
  );
};

export default Home;
