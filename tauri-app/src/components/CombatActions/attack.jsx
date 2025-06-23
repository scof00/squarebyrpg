import { useEffect, useState, useRef } from "react";
import "../../styles/combat.css";
import { modifyAttack } from "../CombatActions/attackModification"; // import your function

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export const AttackSequence = ({ trigger, onResolve, onDismiss }) => {
  const [diceValues, setDiceValues] = useState([null, null, null]);
  const [modBreakdown, setModBreakdown] = useState([]);
  const [finalTotal, setFinalTotal] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const hasResolved = useRef(false);

  useEffect(() => {
    if (trigger && !popupVisible) {
      setPopupVisible(true);
      hasResolved.current = false;
      runRoll();
    }
  }, [trigger]);

  const playDiceSound = () => {
    new Audio("/sounds/dice-roll.mp3").play();
  };

  const playSwordSound = () => {
    new Audio("/sounds/sword-slice.mp3").play();
  };

  const rollDie = (index, delay) =>
    new Promise((resolve) => {
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

  const runRoll = async () => {
    setDiceValues([null, null, null]); // clear dice faces
    setModBreakdown([]); // clear modifier breakdown lines
    setFinalTotal(null);
    const results = [];
    for (let i = 0; i < 3; i++) {
      const result = await rollDie(i, 60);
      results.push(result);
    }

    const baseTotal = results.reduce((a, b) => a + b, 0);
    const { breakdown, total } = modifyAttack(baseTotal);

    setModBreakdown([`Base Roll: ${baseTotal}`, ...breakdown]);
    setFinalTotal(total);

    playSwordSound();

    if (!hasResolved.current) {
      onResolve(total);
      hasResolved.current = true;
    }
  };

  const handleDismiss = () => {
    setPopupVisible(false);
    onDismiss();
  };

  if (!popupVisible) return null;

  return (
    <div className="dicePopupOverlay">
      <div className="dicePopupContent">
        <div className="diceRow">
          {diceValues.map((val, i) => (
            <div key={i} className="die">
              {val !== null ? diceFaces[val - 1] : "?"}
            </div>
          ))}
        </div>

        <div className="diceBreakdown" style={{ marginTop: "1rem" }}>
          {modBreakdown.map((line, idx) => (
            <div key={idx} style={{ marginBottom: "0.3rem" }}>
              {line}
            </div>
          ))}
        </div>

        {finalTotal !== null && (
          <div style={{ fontWeight: "bold", marginTop: "1rem" }}>
            Total Damage: {finalTotal}
          </div>
        )}

        <button
          className="dismissButton"
          onClick={handleDismiss}
          style={{ marginTop: "1.5rem", padding: "0.5rem 1rem" }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
