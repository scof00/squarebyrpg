import { Button } from "reactstrap";
import "../styles/combat.css";
import { useState } from "react";

export const CombatGeneric = () => {
  const enemies = useState([]);
  const [attacking, setAttacking] = useState(false);

  const getEnemies = () => {

  }

  const handleAttack = () => {
    if (attacking) return; // prevent spamming while animating
    setAttacking(true);
    // Remove attack class after animation ends (1s here)
    setTimeout(() => setAttacking(false), 1000);
  };

  return (
    <div className="genericCombat">
      <h1 className="combatTitle">⚔︎ Combat ⚔︎</h1>
      <div className="opponentContainer">
        <div className="circle"></div>
        <div className="nameCard opponentNameCard">
          <div className="pokemonName">Enemy Circle</div>
          <div
            className="healthBar"
            style={{
              width: "220px",
              height: "18px",
              backgroundColor: "#bfbfbf",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "inset 0 0 5px #6c6c6c",
              marginBottom: "10px",
            }}
          >
            <div className="healthFill" style={{ width: 100 }}></div>
          </div>
        </div>
      </div>
      <div className="playerContainer">
        <div className={`square ${attacking ? "attack" : ""}`}></div>
        <div className="nameCard playerNameCard">
          <div className="pokemonName">Squareby</div>
          <div
            className="healthBar"
            style={{
              width: "220px",
              height: "18px",
              backgroundColor: "#bfbfbf",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "inset 0 0 5px #6c6c6c",
              marginBottom: "10px",
            }}
          >
            <div className="healthFill" style={{ width: 100 }}></div>
          </div>
        </div>
      </div>

      <div className="combatOptions">
        <Button className="combatOption" onClick={handleAttack}>Attack</Button>
        <Button className="combatOption">Defend</Button>
        <Button className="combatOption">Item</Button>
        <Button className="combatOption">Run</Button>
      </div>
    </div>
  );
};
