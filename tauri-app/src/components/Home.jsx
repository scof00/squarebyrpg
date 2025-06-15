import React, { use, useEffect } from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
export const Home = () => {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/devPanel");
  };

  const goToCombat = () => {
    navigate("/combat");
  };
  return (
    <main>
      <h1>Squareby RPG</h1>
      <Button onClick={goToHome}>Dev Panel</Button>
      <Button onClick={goToCombat}>Combat</Button>
    </main>
  );
};
