// components/AttackSequence.jsx
import { useEffect, useState } from "react";
import "../../styles/combat.css";

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export const AttackSequence = ({ onResolve }) => {
  const [diceValues, setDiceValues] = useState([null, null, null]);
  const [showDice, setShowDice] = useState(true);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    startSequence();
  }, []);

  const playDiceSound = () => {
    const audio = new Audio("/sounds/dice-roll.mp3");
    audio.play();
  };

  const playSwordSound = () => {
    const audio = new Audio("/sounds/sword-slice.mp3")
    audio.play();
  }

  const rollDie = (index, delay) => {
    return new Promise((resolve) => {
      let rollCount = 0;
      const interval = setInterval(() => {
        const val = Math.ceil(Math.random() * 6);
        setDiceValues((prev) => {
          const updated = [...prev];
          updated[index] = val;
          return updated;
        });
        if (rollCount === 0) playDiceSound();
        rollCount++;
        if (rollCount >= 10) {
          clearInterval(interval);
          resolve(val);
        }
      }, delay);
    });
  };

  const startSequence = async () => {
    const results = [];
    setDiceValues([null, null, null]);

    for (let i = 0; i < 3; i++) {
      const result = await rollDie(i, 60);
      results[i] = result;
    }

    const totalDamage = results.reduce((a, b) => a + b, 0);
    setTotal(totalDamage);

    setTimeout(() => {
      setShowDice(false);
      onResolve(totalDamage);
      playSwordSound()
    }, 800);
  };

  return (
    <>
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
          Total: {total}
        </div>
      )}
    </>
  );
};
