import { Container } from "@mui/material";
import CredentialsList from "components/credential/credentials-list";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      Home Page
      <br />
      <Link to={{ pathname: "/credentials-creation" }}>Criar Credencial</Link>
      <CredentialsList />
    </Container>
  );
};

export default Home;
