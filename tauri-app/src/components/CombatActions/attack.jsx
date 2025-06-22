// components/AttackSequence.jsx
import { useEffect, useRef, useState } from "react";
import "../../styles/combat.css";

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export const AttackSequence = ({ onResolve }) => {
  const [diceValues, setDiceValues] = useState([null, null, null]);
  const [showDice, setShowDice] = useState(true);
  const resolved = useRef(false);
  const totalRef = useRef(null);
  useEffect(() => {
    startSequence();
  }, []);

  const playDiceSound = () => {
    const audio = new Audio("/sounds/dice-roll.mp3");
    audio.play();
  };

  const playSwordSound = () => {
    const audio = new Audio("/sounds/sword-slice.mp3");
    audio.play();
  };

  const rollDie = (index, delay) => {
    return new Promise((resolve) => {
      let rollCount = 0;
      let val = 1;

      const interval = setInterval(() => {
        val = Math.ceil(Math.random() * 6);

        if (rollCount > 0) {
          // Only update diceValues starting from second tick
          setDiceValues((prev) => {
            const updated = [...prev];
            updated[index] = val;
            return updated;
          });
          if (rollCount === 1) playDiceSound();
        }

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
      results.push(result);
    }

    const totalDamage = results.reduce((a, b) => a + b, 0);
    totalRef.current = totalDamage; // store in ref for render

    console.log("Final rolled values:", results, "Total damage:", totalDamage);

    setTimeout(() => {
      if (!resolved.current) {
        resolved.current = true;
        onResolve(totalRef.current); // use exact value displayed
        playSwordSound();
        setShowDice(false);
      }
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
      {totalRef.current !== null && (
        <div className="diceTotal">Total: {totalRef.current}</div>
      )}
    </>
  );
};
