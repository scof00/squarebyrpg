import "../styles/home.css";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const goToHome = () => navigate("/devPanel");
  const goToCombat = () => navigate("/combat");

  return (
    <main className="homePage">
      <h1 className="homeTitle">Squareby</h1>
      <Button className="homePage__button" onClick={goToHome}>Dev Panel</Button>
      <Button className="homePage__button" onClick={goToCombat}>Combat</Button>
    </main>
  );
};
