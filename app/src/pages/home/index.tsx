import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      Home Page
      <br />
      <Link to={{ pathname: "/credentials-creation" }}>Criar Credencial</Link>
    </div>
  );
};

export default Home;
