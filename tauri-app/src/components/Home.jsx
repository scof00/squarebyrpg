import "../styles/home.css";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import React from "react";
import useGamepadNavigation from "../Utils/useGamepad";

export const Home = () => {
  const navigate = useNavigate();
  const goToDevPanel = () => navigate("/devPanel");
  const goToCombat = () => navigate("/combat");
  const gameStart = () => navigate("/Scene1");

  const buttons = [
    { label: "New Game", onClick: gameStart },
    { label: "Continue" },
    { label: "Options" },
    { label: "Combat", onClick: goToCombat },
    { label: "Dev Panel", onClick: goToDevPanel },
  ];

  const { selectedIndex } = useGamepadNavigation(buttons);

  return (
    <main className="homePage">
      <h1 className="homeTitle">Squareby</h1>
      {buttons.map((btn, i) => (
        <Button
          key={btn.label}
          className={`homePage__button ${i === selectedIndex ? "selected" : ""}`}
          onClick={btn.onClick}
        >
          {btn.label}
        </Button>
      ))}
    </main>
  );
};
