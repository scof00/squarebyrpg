import { Button } from "reactstrap";
import "../styles/combat.css";
import { useState } from "react";

export const CombatGeneric = () => {
  const enemies = useState([]);
  const [attacking, setAttacking] = useState(false);
  const [diceValues, setDiceValues] = useState([null, null, null]);
  const [showDice, setShowDice] = useState(false);
  const [total, setTotal] = useState(null);
  const [enemyHealth, setEnemyHealth] = useState({ currentHP: 50, maxHP: 50 });

  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  const playDiceSound = () => {
    const audio = new Audio("/sounds/dice-roll.mp3");
    audio.play();
  };

  const playSwordSound = () => {
    const audio = new Audio("/sounds/sword-slice.mp3");
    audio.play();
  };

const handleAttack = () => {
  if (attacking) return;
  rollDiceSequentially();
};

const rollDiceSequentially = async () => {
  setShowDice(true);
  setDiceValues([null, null, null]);
  setTotal(null);

  const newDiceValues = [];

  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => {
      let rollCount = 0;
      let finalValue = 1;
      const interval = setInterval(() => {
        const val = Math.ceil(Math.random() * 6);
        finalValue = val;
        setDiceValues((prev) => {
          const updated = [...prev];
          updated[i] = val;
          return updated;
        });
        rollCount++;
        if (rollCount === 1) playDiceSound();
        if (rollCount >= 10) {
          clearInterval(interval);
          newDiceValues[i] = finalValue;
          resolve();
        }
      }, 60);
    });
  }

  const finalTotal = newDiceValues.reduce((sum, val) => sum + val, 0);
  setTotal(finalTotal);

  setEnemyHealth((prev) => ({
    currentHP: Math.max(prev.currentHP - finalTotal, 0),
    maxHP: prev.maxHP,
  }));

  // Show dice total for 2 seconds, then trigger attack animation
  setTimeout(() => {
    setShowDice(false);
    setTotal(null);
    setDiceValues([null, null, null]);

    // Reset attack to false first so class can be re-applied
    setAttacking(false);

    // Small timeout to let React remove class before re-adding
    setTimeout(() => {
      setAttacking(true);
      setTimeout(() => {
        playSwordSound()
      }, 200);
      // Remove attack class after animation duration (500ms)
      setTimeout(() => setAttacking(false), 500);
    }, 50);
  }, 700);
};

  const enemyHealthPercent = (enemyHealth.currentHP / enemyHealth.maxHP) * 100;

  return (
    <div className="genericCombat">
      <h1 className="combatTitle">⚔︎ Combat ⚔︎</h1>
      {showDice && (
        <div className="diceContainer">
          {diceValues.map((val, i) => (
            <div key={i} className="die">
              {val !== null ? diceFaces[val - 1] : "?"}
            </div>
          ))}
        </div>
      )}
      {total !== null && (
        <div className="diceTotal">
          Total: {diceValues.reduce((a, b) => a + b, 0)}
        </div>
      )}
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
            <div
              className="healthFill"
              style={{
                width: `${enemyHealthPercent}%`,
                transition: "width 0.5s ease",
              }}
            ></div>
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
        <Button className="combatOption" onClick={handleAttack}>
          Attack
        </Button>
        <Button className="combatOption">Defend</Button>
        <Button className="combatOption">Item</Button>
        <Button className="combatOption">Run</Button>
      </div>
    </div>
  );
};
